import { createApp, h } from 'vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router';
import type { VontClientOptions } from '../types/index.js';

/**
 * 将文件路由转换为 Vue Router 路由路径
 */
function getRoutePath(filePath: string): string {
  // 移除各种可能的 pages 路径前缀和文件扩展名
  let route = filePath
    .replace(/^(\.\.?\/|\/)?(?:src\/)?pages\//, '')
    .replace(/\.(vue|tsx|ts|jsx|js)$/, '');

  // 处理 index 文件
  if (route.endsWith('/index')) {
    route = route.replace(/\/index$/, '');
  } else if (route === 'index') {
    route = '';
  }

  // 将 [param] 转换为 :param
  route = route.replace(/\[([^\]]+)\]/g, ':$1');

  // 处理根路由
  return route ? '/' + route : '/';
}

/**
 * 生成 Vue Router 路由配置
 */
function generateRoutes(pageModules: Record<string, any>) {
  const routes = [];

  for (const [filePath, module] of Object.entries(pageModules)) {
    const path = getRoutePath(filePath);
    routes.push({
      path,
      component: module.default || module,
    });
  }

  // 添加 404 路由
  routes.push({
    path: '/:pathMatch(.*)*',
    component: {
      setup() {
        return () => h('div', { style: 'padding: 20px; text-align: center;' }, [
          h('h1', '404 - Page Not Found'),
          h('p', "The page you're looking for doesn't exist."),
        ]);
      },
    },
  });

  return routes;
}

/**
 * 渲染 Vue 应用
 */
export function renderVueApp(options: VontClientOptions) {
  const routes = generateRoutes(options.pagesGlob);

  // 创建 Vue Router
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  // 创建 Vue 应用 - 使用渲染函数而不是模板字符串
  const app = createApp({
    setup() {
      return () => h(RouterView);
    },
  });

  app.use(router);

  // 挂载到 DOM
  const root = document.getElementById('root');
  if (root) {
    app.mount(root);
  } else {
    console.error('Root element not found. Make sure you have a <div id="root"></div> in your HTML.');
  }
}

