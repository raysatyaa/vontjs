import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { VontClientOptions } from '../types/index.js';

/**
 * 将文件路由转换为 React Router 路由路径
 */
function getRoutePath(filePath: string): string {
  // 移除各种可能的 pages 路径前缀和文件扩展名
  // 支持: ./pages/, ../pages/, /pages/, /src/pages/, ./src/pages/
  let route = filePath
    .replace(/^(\.\.?\/|\/)?(?:src\/)?pages\//, '')
    .replace(/\.(tsx|ts|jsx|js)$/, '');

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
 * 生成路由表
 */
function generateRoutes(
  pageModules: Record<string, { default: React.ComponentType }>
): Array<{ path: string; component: React.ComponentType }> {
  const routes: Array<{ path: string; component: React.ComponentType }> = [];

  for (const [filePath, module] of Object.entries(pageModules)) {
    const path = getRoutePath(filePath);
    routes.push({
      path,
      component: module.default,
    });
  }

  // 排序路由，确保更具体的路由在前面
  routes.sort((a, b) => {
    const aSpecificity = (a.path.match(/:/g) || []).length;
    const bSpecificity = (b.path.match(/:/g) || []).length;
    return bSpecificity - aSpecificity;
  });

  return routes;
}

/**
 * 默认 404 页面
 */
function DefaultNotFound() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

/**
 * Vont 客户端应用
 */
export function VontApp({ pagesGlob, notFoundComponent }: VontClientOptions) {
  const routes = generateRoutes(pagesGlob);
  const NotFound = notFoundComponent || DefaultNotFound;

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * 渲染 Vont 应用
 */
export function renderVontApp(options: VontClientOptions) {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <VontApp {...options} />
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found. Make sure you have a <div id="root"></div> in your HTML.');
  }
}

