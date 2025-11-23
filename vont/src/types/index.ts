import type { Context, Next } from 'koa';

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
  component: any; // 使用 any 避免强制依赖 React 类型
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
 * 
 * 注意：viteConfig 使用 any 类型以避免 Vite 版本不一致导致的类型冲突
 * 这样可以兼容项目中不同版本的 Vite
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
  
  // 前端框架类型（用于生成正确的客户端代码）
  framework?: 'react' | 'vue';
  
  // Vite 配置（使用 any 避免版本冲突）
  viteConfig?: any;
  
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

/**
 * 插件类型擦除辅助函数
 * 用于避免不同 Vite 版本之间的类型冲突
 * 
 * @example
 * ```ts
 * import { defineConfig, vitePlugin } from 'vont';
 * import vue from '@vitejs/plugin-vue';
 * 
 * export default defineConfig({
 *   viteConfig: {
 *     plugins: [
 *       vitePlugin(vue()),
 *     ],
 *   },
 * });
 * ```
 */
export function vitePlugin(plugin: any): any {
  return plugin;
}

/**
 * 插件数组类型擦除辅助函数
 * 用于处理返回插件数组的情况
 * 
 * @example
 * ```ts
 * import { defineConfig, vitePlugins } from 'vont';
 * import tailwindcss from '@tailwindcss/vite';
 * 
 * export default defineConfig({
 *   viteConfig: {
 *     plugins: vitePlugins([
 *       tailwindcss(),
 *     ]),
 *   },
 * });
 * ```
 */
export function vitePlugins(plugins: any[]): any[] {
  return plugins;
}

// ========================================
// 客户端类型
// ========================================

/**
 * Vont 客户端选项
 */
export interface VontClientOptions {
  pagesGlob: Record<string, { default: any }>; // 使用 any 避免强制依赖 React 类型
  notFoundComponent?: any; // 使用 any 避免强制依赖 React 类型
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
  framework?: 'react' | 'vue';
}

/**
 * 虚拟服务器生成选项
 */
export interface VirtualServerOptions {
  // 预留扩展
}
