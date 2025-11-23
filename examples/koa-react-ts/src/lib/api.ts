/**
 * API 客户端工具函数
 * 用于在前端页面中调用后端接口
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

/**
 * 构建查询字符串
 */
function buildQueryString(params: Record<string, any>): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return entries.length > 0 ? `?${entries.join('&')}` : '';
}

/**
 * API 请求函数
 */
export async function fetchApi<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // 构建完整 URL
  let url = `/api${path.startsWith('/') ? path : '/' + path}`;
  if (params) {
    url += buildQueryString(params);
  }

  // 默认设置
  const finalOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  };

  try {
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `API error: ${response.statusText} (${response.status})`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
}

/**
 * GET 请求
 */
export async function get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
  return fetchApi<T>(path, { method: 'GET', params });
}

/**
 * POST 请求
 */
export async function post<T = any>(
  path: string,
  body?: any,
  options?: Omit<FetchOptions, 'body'>
): Promise<T> {
  return fetchApi<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
}

/**
 * PUT 请求
 */
export async function put<T = any>(
  path: string,
  body?: any,
  options?: Omit<FetchOptions, 'body'>
): Promise<T> {
  return fetchApi<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  });
}

/**
 * DELETE 请求
 */
export async function del<T = any>(path: string, options?: FetchOptions): Promise<T> {
  return fetchApi<T>(path, { method: 'DELETE', ...options });
}

/**
 * PATCH 请求
 */
export async function patch<T = any>(
  path: string,
  body?: any,
  options?: Omit<FetchOptions, 'body'>
): Promise<T> {
  return fetchApi<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
    ...options,
  });
}
