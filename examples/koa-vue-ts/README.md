# Vont Framework - Vue 3 + TypeScript Example

这是一个使用 Vont Framework、Vue 3 和 TypeScript 构建的全栈应用示例。

## ✨ 特性

- 🎨 **Vue 3** - 渐进式 JavaScript 框架
- 🔤 **TypeScript** - 类型安全
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 📁 **文件路由** - 基于文件系统的路由
- 🔥 **热模块替换** - 即时反馈
- 🚀 **零配置** - 开箱即用

## 📁 项目结构

```
koa-vue-ts/
├── src/
│   ├── api/                    # API 路由
│   │   ├── users.ts            # GET/POST /api/users
│   │   └── users/
│   │       └── [id].ts         # GET/PUT/DELETE /api/users/:id
│   ├── pages/                  # Vue 页面
│   │   ├── index.vue           # 首页
│   │   ├── about.vue           # 关于页
│   │   └── users.vue           # 用户管理页
│   ├── components/             # Vue 组件
│   ├── lib/                    # 工具函数
│   │   └── api.ts              # API 客户端封装
│   ├── styles/                 # 样式文件
│   │   └── app.css
│   └── types/                  # 类型定义
│       └── api.ts
├── .vont/                      # 框架内部文件（自动生成）
├── index.html                  # HTML 入口
├── vont.config.ts              # Vont 配置
├── tsconfig.json               # TypeScript 配置
└── package.json
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm run start
```

## 📝 示例功能

### 1. API 路由

文件基础路由自动映射为 API 端点：

- `src/api/users.ts` → GET/POST `/api/users`
- `src/api/users/[id].ts` → GET/PUT/DELETE `/api/users/:id`

**示例 API：**

```typescript
// src/api/users.ts
import type { Context } from 'koa';

export const get = async (ctx: Context) => {
  ctx.body = { data: users };
};

export const post = async (ctx: Context) => {
  const { name, email } = ctx.request.body;
  // 创建用户逻辑
};
```

### 2. Vue 页面

文件自动映射为页面路由：

- `src/pages/index.vue` → `/`
- `src/pages/about.vue` → `/about`
- `src/pages/users.vue` → `/users`

**示例页面：**

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const title = ref('Hello Vont!');
const message = ref('Built with Vue 3 + TypeScript');
</script>
```

### 3. API 客户端

类型安全的 API 调用：

```typescript
import { userApi } from '@/lib/api';

// 获取所有用户
const response = await userApi.getAll();
const users = response.data;

// 创建用户
await userApi.create({ name: 'John', email: 'john@example.com' });
```

### 4. 类型共享

前后端共享类型定义：

```typescript
// src/types/api.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

// 前端使用
const users = ref<User[]>([]);

// 后端使用
export const get = async (ctx: Context): Promise<void> => {
  const users: User[] = [];
  ctx.body = { data: users };
};
```

## 🛠️ 技术栈

### 前端
- **Vue 3** - 渐进式框架
- **Vue Router** - 路由管理
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具

### 后端
- **Koa** - Web 框架
- **TypeScript** - 类型安全
- **Vont** - 文件路由框架

## 📚 了解更多

- [Vont Framework 文档](../../vont/README.md)
- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 📄 许可

MIT

