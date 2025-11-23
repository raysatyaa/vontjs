import type { VirtualClientOptions } from '../types/index.js';

/**
 * 生成 React 客户端入口代码
 */
function generateReactClient(stylesGlob: string, pagesGlob: string): string {
  return `
import { renderVontApp } from 'vont/client';

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

/**
 * 生成 Vue 客户端入口代码
 */
function generateVueClient(stylesGlob: string, pagesGlob: string): string {
  return `
import { renderVueApp } from 'vont/client/vue';

// 动态导入样式（如果存在）
const styleModules = import.meta.glob('${stylesGlob}', { eager: true });

// 动态导入所有页面
const pageModules = import.meta.glob('${pagesGlob}', { eager: true });

// 渲染应用
renderVueApp({
  pagesGlob: pageModules,
});
`.trim();
}

/**
 * 生成虚拟客户端入口代码
 * 用于开发和构建时动态生成 client.tsx
 */
export function generateVirtualClient(options?: VirtualClientOptions): string {
  const stylesGlob = options?.stylesGlob || '/src/styles/**/*.css';
  const pagesGlob = options?.pagesGlob || '/src/pages/**/*.{tsx,jsx,vue}';
  const framework = options?.framework || 'react';

  if (framework === 'vue') {
    return generateVueClient(stylesGlob, pagesGlob);
  }

  return generateReactClient(stylesGlob, pagesGlob);
}

