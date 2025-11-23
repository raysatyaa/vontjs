import type { Context, Next } from 'koa';
import type { PluginOption, UserConfig as ViteUserConfig } from 'vite';

// ========================================
// 基础类型
// ========================================

/**
 * 路由处理函数类型
 */
export type RouteHandler = (ctx: Context) => Promise<void>;

/**
 * 中间件类型
 */
export type Middleware = (ctx: Context, next: Next) => Promise<void>;

// ========================================
// 路由配置
// ========================================

/**
 * API 路由配置
 */
export interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
  handler: RouteHandler;
  middleware: Middleware[];
}

/**
 * 页面路由配置
 */
export interface PageRouteConfig {
  path: string;
  component: React.ComponentType<unknown>;
}

/**
 * API 模块导出类型
 */
export interface ApiModule {
  get?: RouteHandler;
  post?: RouteHandler;
  put?: RouteHandler;
  delete?: RouteHandler;
  patch?: RouteHandler;
  options?: RouteHandler;
  middleware?: Middleware[];
}

// ========================================
// Vont 框架配置
// ========================================

/**
 * Vont 框架配置接口
 */
export interface VontConfig {
  // 基础配置
  root?: string;
  port?: number;
  host?: string;
  apiPrefix?: string;
  
  // 目录配置
  apiDir?: string;
  pagesDir?: string;
  outDir?: string;
  
  // Vite 配置（完整的 Vite UserConfig）
  viteConfig?: Partial<ViteUserConfig>;
  
  // 服务器配置
  server?: {
    hmrPort?: number;
    middlewares?: Middleware[];
  };
  
  // 构建配置
  build?: {
    sourcemap?: boolean;
    minify?: boolean;
    target?: string;
  };
  
  // 开发模式标志（内部使用）
  isDev?: boolean;
}

/**
 * 开发服务器选项
 */
export interface DevServerOptions extends VontConfig {
  isDev: true;
  hmrPort?: number;
}

/**
 * 构建选项
 */
export interface BuildOptions extends VontConfig {
  root: string;
  outDir: string;
  apiDir?: string;
  serverDir?: string;
}

/**
 * 配置定义辅助函数
 * 用于在 vont.config.ts 中获得类型提示
 */
export function defineConfig(config: VontConfig): VontConfig {
  return config;
}

// ========================================
// 客户端类型
// ========================================

/**
 * Vont 客户端选项
 */
export interface VontClientOptions {
  pagesGlob: Record<string, { default: React.ComponentType }>;
  notFoundComponent?: React.ComponentType;
}

// ========================================
// 虚拟模块生成选项
// ========================================

/**
 * 虚拟客户端生成选项
 */
export interface VirtualClientOptions {
  stylesGlob?: string;
  pagesGlob?: string;
}

/**
 * 虚拟服务器生成选项
 */
export interface VirtualServerOptions {
  // 预留扩展
}
