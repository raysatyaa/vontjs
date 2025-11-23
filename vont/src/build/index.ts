import { build as esbuild } from 'esbuild';
import { build as viteBuild } from 'vite';
import path from 'path';
import { promises as fs } from 'fs';
import type { BuildOptions, VontConfig } from '../types/index.js';
import { loadConfig } from '../config/loader.js';
import { generateVirtualClient } from '../generators/virtual-client.js';
import { generateVirtualServer } from '../generators/virtual-server.js';

/**
 * 递归查找所有 API 文件
 */
async function findApiFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await findApiFiles(fullPath));
      } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // 目录不存在
  }

  return files;
}

/**
 * 清理临时文件
 */
async function cleanupTempFile(filePath: string, directory?: string): Promise<void> {
  try {
    await fs.unlink(filePath);
    
    // 如果指定了目录，尝试删除空目录
    if (directory) {
      try {
        const dirFiles = await fs.readdir(directory);
        if (dirFiles.length === 0) {
          await fs.rmdir(directory);
        }
      } catch {
        // 忽略错误
      }
    }
  } catch {
    // 忽略错误
  }
}

/**
 * 构建项目
 */
export async function buildProject(options?: BuildOptions): Promise<void> {
  try {
    // 加载配置
    const rootDir = options?.root || process.cwd();
    const config: VontConfig = await loadConfig(rootDir);
    
    // 合并构建选项
    const outDir = options?.outDir || config.outDir || path.join(rootDir, 'dist');
    const serverDir = options?.serverDir || path.join(outDir, 'server');
    const apiDir = options?.apiDir || config.apiDir || path.join(rootDir, 'src', 'api');

    console.log('🔨 Building project...\n');

    // ========================================
    // 1. 准备 .vont 目录
    // ========================================
    const vontDir = path.join(rootDir, '.vont');
    await fs.mkdir(vontDir, { recursive: true });
    
    // 生成客户端入口文件
    const clientPath = path.join(vontDir, 'client.tsx');
    
    // 检测框架类型（从配置或自动检测）
    let framework: 'react' | 'vue' = config.framework || 'react';
    if (!config.framework) {
      // 自动检测：检查 package.json 中的依赖
      try {
        const pkgPath = path.join(rootDir, 'package.json');
        const pkgContent = await fs.readFile(pkgPath, 'utf-8');
        const pkg = JSON.parse(pkgContent);
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        if (allDeps.vue) {
          framework = 'vue';
        }
      } catch {
        // 使用默认值 react
      }
    }
    
    const virtualClientContent = generateVirtualClient({ framework });
    await fs.writeFile(clientPath, virtualClientContent, 'utf-8');

    // ========================================
    // 2. 构建前端代码
    // ========================================
    console.log('📦 Building frontend...');
    
    // 合并用户的 Vite 配置，提供合理的默认值
    const viteConfig = config.viteConfig || {};
    
    // 准备 Vite 插件列表
    const vitePlugins = [
      // 用户配置的 Vite 插件
      ...(Array.isArray(viteConfig.plugins) ? viteConfig.plugins : viteConfig.plugins ? [viteConfig.plugins] : []),
    ];
    
    
    // 生成临时的 index.html（如果项目中不存在）
    const indexHtmlPath = path.join(rootDir, 'index.html');
    const indexHtmlExists = await fs.access(indexHtmlPath).then(() => true).catch(() => false);
    
    if (!indexHtmlExists) {
      console.log('📝 Generating temporary index.html...');
      const tempHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vont App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/.vont/client.tsx"></script>
</body>
</html>`;
      await fs.writeFile(indexHtmlPath, tempHtml, 'utf-8');
    }
    
    await viteBuild({
      root: rootDir,
      plugins: viteConfig.plugins, 
      build: {
        outDir: path.join(outDir, 'client'),
        emptyOutDir: false,
        rollupOptions: {
          input: indexHtmlPath,
          output: {
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash][extname]',
          },
        },
        sourcemap: config.build?.sourcemap !== false,
        minify: config.build?.minify !== false,
        target: config.build?.target || 'es2020',
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
    });
    
    console.log('✅ Frontend built\n');

    // 清理临时生成的 index.html 和 .vont 目录
    if (!indexHtmlExists) {
      await cleanupTempFile(indexHtmlPath);
    }
    await fs.rm(vontDir, { recursive: true, force: true });

    // ========================================
    // 3. 生成虚拟 server/index.ts
    // ========================================
    console.log('📦 Building backend...');
    
    await fs.mkdir(serverDir, { recursive: true });

    const serverIndexPath = path.join(rootDir, 'server', 'index.ts');
    const serverExists = await fs.access(serverIndexPath).then(() => true).catch(() => false);
    
    if (!serverExists) {
      await fs.mkdir(path.join(rootDir, 'server'), { recursive: true });
      const virtualServerContent = generateVirtualServer();
      await fs.writeFile(serverIndexPath, virtualServerContent, 'utf-8');
    }

    // ========================================
    // 4. 编译后端代码
    // ========================================
    const serverFiles = [serverIndexPath];

    await esbuild({
      entryPoints: serverFiles,
      outdir: serverDir,
      bundle: true,
      format: 'esm',
      platform: 'node',
      target: config.build?.target || 'es2020',
      minify: config.build?.minify !== false,
      sourcemap: config.build?.sourcemap !== false,
      external: ['koa', 'koa-router', 'koa-bodyparser', 'koa-static', 'vont'],
      logLevel: 'info',
    });

    console.log('✅ Backend built');

    // 清理生成的 server/index.ts
    if (!serverExists) {
      await cleanupTempFile(serverIndexPath, path.join(rootDir, 'server'));
    }

    // ========================================
    // 5. 编译 API 模块
    // ========================================
    console.log('\n📦 Compiling API modules...');
    const apiDistDir = path.join(outDir, 'api');

    try {
      const apiFiles = await findApiFiles(apiDir);

      if (apiFiles.length > 0) {
        await esbuild({
          entryPoints: apiFiles,
          outdir: apiDistDir,
          format: 'esm',
          platform: 'node',
          target: config.build?.target || 'es2020',
          minify: false, // API 模块不压缩，便于调试
          splitting: false,
          logLevel: 'info',
        });

        console.log(`✅ Compiled ${apiFiles.length} API modules\n`);
      } else {
        console.log('⚠️  No API files found\n');
      }
    } catch (error) {
      const err = error as Error;
      console.error('⚠️  Warning: Could not compile API files:', err.message);
    }

    console.log('✨ Build completed successfully!\n');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * CLI 导出命令
 */
export async function buildCommand(): Promise<void> {
  await buildProject();
}

