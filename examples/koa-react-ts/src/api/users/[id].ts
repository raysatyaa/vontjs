import type { Context } from 'koa';
import type { User, ApiResponse } from '../../types/api';

// 模拟数据
const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

/**
 * GET /api/users/:id
 * 获取单个用户
 */
export const get = async (ctx: Context): Promise<void> => {
  const userId = parseInt(ctx.params.id as string);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    ctx.status = 404;
    ctx.body = {
      error: 'User not found',
    };
    return;
  }

  ctx.body = {
    data: user,
  } as ApiResponse<User>;
};

/**
 * PUT /api/users/:id
 * 更新用户
 */
export const put = async (ctx: Context): Promise<void> => {
  const userId = parseInt(ctx.params.id as string);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    ctx.status = 404;
    ctx.body = {
      error: 'User not found',
    };
    return;
  }

  const { name, email } = (ctx.request as any).body as { name?: string; email?: string };

  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;

  ctx.body = {
    data: users[userIndex],
  } as ApiResponse<User>;
};

/**
 * DELETE /api/users/:id
 * 删除用户
 */
export const del = async (ctx: Context): Promise<void> => {
  const userId = parseInt(ctx.params.id as string);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    ctx.status = 404;
    ctx.body = {
      error: 'User not found',
    };
    return;
  }

  users.splice(userIndex, 1);

  ctx.status = 204;
};
