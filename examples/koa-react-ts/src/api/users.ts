import type { Context } from 'koa';
import type { User, ApiResponse } from '../types/api';

// 模拟数据
const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

/**
 * GET /api/users
 * 获取所有用户
 */
export const get = async (ctx: Context): Promise<void> => {
  ctx.body = {
    data: users,
  } as ApiResponse<User[]>;
};

/**
 * POST /api/users
 * 创建新用户
 */
export const post = async (ctx: Context): Promise<void> => {
  const { name, email } = (ctx.request as any).body as { name: string; email: string };

  if (!name || !email) {
    ctx.status = 400;
    ctx.body = {
      error: 'Name and email are required',
    };
    return;
  }

  const newUser: User = {
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    name,
    email,
  };

  users.push(newUser);

  ctx.status = 201;
  ctx.body = {
    data: newUser,
  } as ApiResponse<User>;
};
