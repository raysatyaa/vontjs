import { buildProject } from '../build/index.js';

/**
 * CLI 构建命令
 */
export async function buildCommand(): Promise<void> {
  await buildProject();
}

// CLI 入口
buildCommand().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});

