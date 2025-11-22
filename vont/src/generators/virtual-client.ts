import type { VirtualClientOptions } from '../types/index.js';

/**
 * 生成虚拟客户端入口代码
 * 用于开发和构建时动态生成 client.tsx
 */
export function generateVirtualClient(options?: VirtualClientOptions): string {
  const stylesGlob = options?.stylesGlob || '/src/styles/**/*.css';
  const pagesGlob = options?.pagesGlob || '/src/pages/**/*.{tsx,jsx}';

  return `
import { renderVontApp } from '@vont/core/client';

// 动态导入样式（如果存在）
const styleModules = import.meta.glob('${stylesGlob}', { eager: true });

// 动态导入所有页面
const pageModules = import.meta.glob('${pagesGlob}', { eager: true });

// 渲染应用
renderVontApp({
  pagesGlob: pageModules,
});
`.trim();
}

