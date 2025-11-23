// 导出服务器相关
export * from './server/app.js';
export * from './server/dev-server.js';
export * from './server/prod-server.js';
export * from './server/production.js';
export * from './server/route-registry.js';
export * from './server/router-generator.js';

// 注意：客户端相关的导出不在主入口中，而是通过 exports 字段访问
// 使用 'vont/client' 或 'vont/client/vue' 来导入客户端代码

// 导出配置相关
export * from './config/loader.js';

// 导出生成器
export * from './generators/virtual-client.js';
export * from './generators/virtual-server.js';

// 导出构建相关
export * from './build/index.js';

// 导出类型
export * from './types/index.js';

