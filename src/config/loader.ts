import { pathToFileURL } from 'url';
import path from 'path';
import { promises as fs } from 'fs';
import { build } from 'esbuild';
import type { VontConfig } from '../types/index.js';

/**
 * 加载 Vont 配置文件
 * 支持 .ts, .js, .mjs 格式
 */
export async function loadConfig(rootDir: string): Promise<VontConfig> {
  const configFiles = [
    'vont.config.ts',
    'vont.config.js',
    'vont.config.mjs'
  ];

  for (const file of configFiles) {
    const configPath = path.join(rootDir, file);
    try {
      await fs.access(configPath);
      console.log(`📝 Loading config from: ${file}`);
      
      let configModule;
      
      // 如果是 TypeScript 文件，使用 esbuild 编译后再导入
      if (file.endsWith('.ts')) {
        const tempDir = path.join(rootDir, '.vont');
        const tempFile = path.join(tempDir, 'config.mjs');
        
        try {
          // 确保临时目录存在
          await fs.mkdir(tempDir, { recursive: true });
          
          // 使用 esbuild 编译配置文件（不打包依赖）
          await build({
            entryPoints: [configPath],
            outfile: tempFile,
            format: 'esm',
            platform: 'node',
            bundle: false,
            logLevel: 'silent',
          });
          
          // 导入编译后的配置
          const timestamp = Date.now();
          configModule = await import(pathToFileURL(tempFile).href + `?t=${timestamp}`);
          
          // 清理临时文件
          await fs.unlink(tempFile).catch(() => {});
        } catch (error) {
          console.error(`⚠️  Failed to compile config file:`, error);
          throw error;
        }
      } else {
        // JS/MJS 文件直接导入
        configModule = await import(pathToFileURL(configPath).href);
      }
      
      const config = configModule.default || configModule;
      
      return mergeWithDefaults(config, rootDir);
    } catch (error) {
      // 文件不存在或加载失败，继续尝试下一个
      continue;
    }
  }

  // 未找到配置文件，使用默认配置
  console.log('📝 Using default configuration');
  return getDefaultConfig(rootDir);
}

/**
 * 获取默认配置
 */
export function getDefaultConfig(rootDir: string): VontConfig {
  return {
    root: rootDir,
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    apiPrefix: '/api',
    apiDir: path.join(rootDir, 'src', 'api'),
    pagesDir: path.join(rootDir, 'src', 'pages'),
    outDir: path.join(rootDir, 'dist'),
    server: {
      hmrPort: parseInt(process.env.HMR_PORT || '3001', 10),
      middlewares: [],
    },
    build: {
      sourcemap: true,
      minify: true,
      target: 'es2020',
    },
  };
}

/**
 * 合并用户配置和默认配置
 */
function mergeWithDefaults(userConfig: Partial<VontConfig>, rootDir: string): VontConfig {
  const defaults = getDefaultConfig(rootDir);
  
  return {
    ...defaults,
    ...userConfig,
    server: {
      ...defaults.server,
      ...userConfig.server,
    },
    build: {
      ...defaults.build,
      ...userConfig.build,
    },
  };
}

/**
 * 验证配置
 */
export function validateConfig(config: VontConfig): void {
  if (!config.root) {
    throw new Error('root directory is required in config');
  }
  
  if (config.port && (config.port < 1 || config.port > 65535)) {
    throw new Error('port must be between 1 and 65535');
  }
  
  if (config.server?.hmrPort && (config.server.hmrPort < 1 || config.server.hmrPort > 65535)) {
    throw new Error('hmrPort must be between 1 and 65535');
  }
}

