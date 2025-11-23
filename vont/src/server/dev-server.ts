import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createHttpServer } from 'http';
import { createServer as createViteServer } from 'vite';
import type { ViteDevServer } from 'vite';
import chokidar from 'chokidar';
import koaConnect from 'koa-connect';
import type Router from 'koa-router';
import { createApp, registerApiRoutes } from './app.js';
import { RouteRegistry } from './route-registry.js';
import type { DevServerOptions, VontConfig } from '../types/index.js';
import { loadConfig } from '../config/loader.js';
import { generateVirtualClient } from '../generators/virtual-client.js';

/**
 * 创建开发服务器
 */
export async function createDevServer(options?: DevServerOptions): Promise<void> {
  try {
    // 注册 tsx loader 以支持 TypeScript 模块加载
    try {
      // @ts-ignore - tsx 的类型声明可能不完整
      const tsx = await import('tsx/esm/api');
      tsx.register();
      console.log('✅ TypeScript loader registered (tsx)');
    } catch (error) {
      console.warn('⚠️  tsx not available, TypeScript API routes may not work');
      console.warn('   Error:', (error as Error).message);
    }

    // 加载配置
    const rootDir = options?.root || process.cwd();
    const config: VontConfig = await loadConfig(rootDir);
    
    // 调试：输出配置加载情况
    console.log('📝 Config loaded:', {
      framework: config.framework,
      hasViteConfig: !!config.viteConfig,
      hasPlugins: !!config.viteConfig?.plugins,
      pluginsCount: Array.isArray(config.viteConfig?.plugins) ? config.viteConfig.plugins.length : 0,
    });
    
    // 合并选项和配置
    const apiDir = options?.apiDir || config.apiDir || path.join(rootDir, 'src', 'api');
    const pagesDir = options?.pagesDir || config.pagesDir || path.join(rootDir, 'src', 'pages');
    const PORT = options?.port || config.port || 3000;
    const HOST = options?.host || config.host || '0.0.0.0';
    const HMR_PORT = options?.hmrPort || config.server?.hmrPort || PORT + 1;

    console.log('🔧 Initializing development server...');

    // 生成虚拟客户端入口代码并写入 .vont 目录
    const vontDir = path.join(rootDir, '.vont');
    await fs.promises.mkdir(vontDir, { recursive: true });
    const clientPath = path.join(vontDir, 'client.tsx');
    
    // 检测框架类型（从配置或自动检测）
    let framework: 'react' | 'vue' = config.framework || 'react';
    if (!config.framework) {
      // 自动检测：检查 package.json 中的依赖
      try {
        const pkgPath = path.join(rootDir, 'package.json');
        const pkgContent = await fs.promises.readFile(pkgPath, 'utf-8');
        const pkg = JSON.parse(pkgContent);
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        if (allDeps.vue) {
          framework = 'vue';
        }
      } catch {
        // 使用默认值 react
      }
    }
    
    const virtualClientEntry = generateVirtualClient({ framework });
    await fs.promises.writeFile(clientPath, virtualClientEntry, 'utf-8');

    // 合并 Vite 配置
    const viteConfig = config.viteConfig || {};
    
    const vite: ViteDevServer = await createViteServer({
      appType: 'custom',
      root: rootDir,
      plugins: viteConfig.plugins, 
      server: {
        host: HOST,
        port: PORT,
        strictPort: false,
        middlewareMode: true,
        hmr: {
          overlay: true,
          port: HMR_PORT,
        },
        watch: {
          usePolling: false,
          interval: 100,
        },
      },
      build: {
        outDir: path.join(config.outDir || 'dist', 'client'),
        emptyOutDir: false,
        rollupOptions: {
          input: path.join(rootDir, 'index.html'),
        },
        sourcemap: true,
      },
      resolve: {
        ...viteConfig.resolve,
        alias: {
          ...viteConfig.resolve?.alias,
          '@': path.join(rootDir, 'src'),
        },
        dedupe: ['react', 'react-dom', 'react-router-dom'],
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'vue', 'vue-router'],
      },
      logLevel: 'info',
    });

    console.log('✅ Vite server initialized');

    // 创建 Koa 应用
    const app = createApp();

    // 初始化路由注册表
    const registry = new RouteRegistry(apiDir, pagesDir, config.apiPrefix);
    await registry.scan();

    // 注册 API 路由（必须在 Vite 中间件之前）
    let apiRouter: Router | undefined;
    const apiRoutes = registry.getApiRoutes();
    apiRouter = registerApiRoutes(app, apiRoutes, apiRouter);

    console.log('✅ API routes registered');

    // 添加 Vite 中间件用于处理前端资源
    // 使用 koa-connect 将 Connect 中间件适配到 Koa
    app.use(koaConnect(vite.middlewares));

    // 设置 API 文件监听（仅在开发模式下）
    const apiWatcher = chokidar.watch(path.join(apiDir, '**/*.ts'), {
      ignored: /(^|[/\\])\../,
      persistent: true,
      ignoreInitial: true,
    });

    let reloadTimeout: NodeJS.Timeout;
    apiWatcher.on('all', async (event, filePath) => {
      // 防抖：避免频繁重载
      clearTimeout(reloadTimeout);
      reloadTimeout = setTimeout(async () => {
        try {
          console.log(`\n🔄 API file ${event}: ${path.relative(rootDir, filePath)}`);
          console.log('♻️  Reloading API routes...');

          // 清除 Node.js 模块缓存
          const absolutePath = path.resolve(filePath);
          const cache = require.cache as Record<string, NodeModule>;
          delete cache[absolutePath];

          // 重新扫描路由
          await registry.scan();
          const newRoutes = registry.getApiRoutes();

          // 更新路由
          apiRouter = registerApiRoutes(app, newRoutes, apiRouter);

          console.log('✅ API routes reloaded\n');
        } catch (error) {
          console.error('❌ Failed to reload API routes:', error);
        }
      }, 300);
    });

    // 提供开发 HTML（SPA 回退）
    app.use(async (ctx) => {
      // 检查响应是否已经被处理（Vite 中间件可能已经处理了请求）
      if (ctx.res.headersSent || ctx.respond === false) {
        return;
      }
      
      // 只为未处理的非 API 路径提供 HTML
      // 排除 /@vont/ 和其他 Vite 特殊路径
      if (!ctx.path.startsWith('/api') && 
          !ctx.path.startsWith('/.vont/') && 
          !ctx.path.startsWith('/@') && 
          !ctx.body) {
        ctx.type = 'text/html';
        ctx.body = await vite.transformIndexHtml(
          ctx.path,
          `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vont Framework - Dev</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/.vont/client.tsx"></script>
</body>
</html>`
        );
      }
    });

    // 使用 HTTP 服务器启动 Koa 应用
    const server = createHttpServer(app.callback());

    server.listen(PORT, HOST, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 Development server is ready!');
      console.log('='.repeat(60));
      console.log(`📍 Local:   http://localhost:${PORT}`);
      console.log(`📍 Network: http://${HOST}:${PORT}`);
      console.log('='.repeat(60));
      console.log('✨ Features:');
      console.log('  - Frontend HMR (React Fast Refresh)');
      console.log('  - API hot reload');
      console.log('  - Server auto-restart (nodemon)');
      console.log('='.repeat(60) + '\n');
    });

    // 优雅关闭
    const shutdown = async (): Promise<void> => {
      console.log('\n🛑 Shutting down gracefully...');
      
      // 设置强制退出超时（3秒）
      const forceExitTimeout = setTimeout(() => {
        console.log('⚠️  Force shutdown (timeout)');
        process.exit(0);
      }, 3000);
      
      try {
        // 关闭文件监听器（快速）
        apiWatcher.close();
        console.log('✅ API watcher closed');
        
        // 关闭 Vite 服务器（可能较慢）
        const viteClosePromise = vite.close();
        const viteTimeout = new Promise((resolve) => setTimeout(resolve, 2000));
        await Promise.race([viteClosePromise, viteTimeout]);
        console.log('✅ Vite server closed');
        
        // 关闭 HTTP 服务器（立即停止接受新连接）
        server.close();
        
        // 强制关闭所有活动连接
        server.closeAllConnections?.(); // Node.js 18.2.0+
        
        console.log('✅ Server closed');
        clearTimeout(forceExitTimeout);
        process.exit(0);
      } catch (error) {
        console.error('❌ Shutdown error:', error);
        clearTimeout(forceExitTimeout);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => void shutdown());
    process.on('SIGINT', () => void shutdown());

  } catch (error) {
    console.error('❌ Failed to start development server:', error);
    process.exit(1);
  }
}

