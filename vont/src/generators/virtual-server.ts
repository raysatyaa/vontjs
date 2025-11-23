import type { VirtualServerOptions } from '../types/index.js';

/**
 * 生成虚拟服务器入口代码
 * 用于构建时动态生成 server/index.ts
 */
export function generateVirtualServer(_options?: VirtualServerOptions): string {
  return `
import { startProductionServer } from 'vont';

// 启动生产服务器
startProductionServer();
`.trim();
}

