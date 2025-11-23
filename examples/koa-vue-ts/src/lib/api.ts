import type { ApiResponse, ApiError } from '../types/api';

/**
 * API 客户端封装
 * 提供统一的 API 调用方法
 */

const API_BASE_URL = '/api';

class ApiClient {
  private async request<T>(
    method: string,
    path: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${path}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      // 处理 204 No Content
      if (response.status === 204) {
        return { data: undefined as any };
      }

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Request failed');
      }

      return json;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path);
  }

  /**
   * POST 请求
   */
  async post<T = any>(path: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, data);
  }

  /**
   * PUT 请求
   */
  async put<T = any>(path: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, data);
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }
}

// 导出单例
export const api = new ApiClient();

/**
 * 用户相关 API
 */
export const userApi = {
  /**
   * 获取所有用户
   */
  getAll: () => api.get('/users'),

  /**
   * 获取单个用户
   */
  getById: (id: number) => api.get(`/users/${id}`),

  /**
   * 创建用户
   */
  create: (data: { name: string; email: string }) =>
    api.post('/users', data),

  /**
   * 更新用户
   */
  update: (id: number, data: { name?: string; email?: string }) =>
    api.put(`/users/${id}`, data),

  /**
   * 删除用户
   */
  delete: (id: number) => api.delete(`/users/${id}`),
};

