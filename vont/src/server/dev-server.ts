import path from 'path';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __dirname = path.dirname(__filename);

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
    } catch {
      console.warn('⚠️  tsx not available, TypeScript API routes may not work');
    }

    // 加载配置
    const rootDir = options?.root || process.cwd();
    const config: VontConfig = await loadConfig(rootDir);
    
    // 合并选项和配置
    const apiDir = options?.apiDir || config.apiDir || path.join(rootDir, 'src', 'api');
    const pagesDir = options?.pagesDir || config.pagesDir || path.join(rootDir, 'src', 'pages');
    const PORT = options?.port || config.port || 3000;
    const HOST = options?.host || config.host || '0.0.0.0';
    const HMR_PORT = options?.hmrPort || config.server?.hmrPort || PORT + 1;

    console.log('🔧 Initializing development server...');

    // 生成虚拟 client 入口
    const virtualClientEntry = generateVirtualClient();

    // 创建 Vite 服务器
    const vitePlugins = [
      // 虚拟模块插件
      {
        name: 'vont-virtual-client',
        resolveId(id: string) {
          if (id === '/client.tsx' || id === '/client.jsx') {
            return '\0virtual:vont-client';
          }
          return null;
        },
        load(id: string) {
          if (id === '\0virtual:vont-client') {
            return virtualClientEntry;
          }
          return null;
        },
      },
      ...(config.vitePlugins || []),
    ];

    const viteConfig = config.viteConfig || {};
    const vite: ViteDevServer = await createViteServer({
      appType: 'custom',
      root: rootDir,
      plugins: vitePlugins,
      server: {
        middlewareMode: true,
        hmr: {
          port: HMR_PORT,
        },
      },
      logLevel: 'info',
      ...viteConfig,
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
      if (!ctx.path.startsWith('/api') && !ctx.body) {
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
  <script type="module" src="/client.tsx"></script>
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
      apiWatcher.close();
      await vite.close();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => void shutdown());
    process.on('SIGINT', () => void shutdown());

  } catch (error) {
    console.error('❌ Failed to start development server:', error);
    process.exit(1);
  }
}

