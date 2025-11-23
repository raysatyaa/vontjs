# Vont Framework

> 🚀 A modern full-stack TypeScript framework combining Koa and React with file-based routing and hot module replacement

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)

---

## 📦 Monorepo Structure

This repository contains:

- **`vont/`** - The core `@vont/core` npm package
- **`demo/`** - Example application showcasing Vont features

---

## ✨ Features

- 📁 **File-based Routing** - Automatic API and page routes based on file structure
- 🔥 **Hot Module Replacement** - Instant feedback during development
- ⚙️ **Zero Configuration** - Convention over configuration, works out of the box
- 🔤 **TypeScript First** - Full type safety across your entire stack
- 📡 **REST API Routes** - Simple function exports become API endpoints
- ⚛️ **React Pages** - File structure becomes page routes
- 🎯 **Type Safety** - Share types between frontend and backend
- 🏗️ **Production Ready** - Single unified deployment

---

## 🚀 Quick Start

### Installation

```bash
npm install @vont/core
```

### Project Setup

```json
{
  "scripts": {
    "dev": "vont dev",
    "build": "vont build",
    "start": "vont start"
  }
}
```

### Project Structure

```
your-project/
├── src/
│   ├── api/              # Backend API routes
│   │   ├── users.ts      # GET/POST /api/users
│   │   └── users/
│   │       └── [id].ts   # GET/PUT /api/users/:id
│   ├── pages/            # Frontend pages
│   │   ├── index.tsx     # GET /
│   │   ├── about.tsx     # GET /about
│   │   └── users.tsx     # GET /users
│   ├── styles/           # Stylesheets
│   │   └── app.css
│   └── types/            # Shared types
│       └── api.ts
├── .vont/                # Framework internal files (auto-generated, git-ignored)
│   └── client.tsx        # Generated client entry (don't edit)
├── index.html            # HTML entry (optional)
├── vont.config.ts        # Vont configuration (optional)
├── .gitignore            # Should include .vont/
└── package.json
```

> **Note**: 
> - No `vite.config.ts` needed! All Vite settings are managed through `vont.config.ts`
> - The `.vont/` directory is auto-generated and should be added to `.gitignore`

### Start Development

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📖 Documentation

For complete documentation, see the [Vont Core Package README](./vont/README.md).

### Key Topics

- [Configuration](./vont/README.md#configuration) - Configure Vont with `vont.config.ts`
- [API Routes](./vont/README.md#api-routes) - File-based API routing
- [Page Routes](./vont/README.md#page-routes) - File-based page routing
- [Programmatic API](./vont/README.md#programmatic-api) - Use Vont programmatically
- [Examples](./vont/README.md#examples) - Real-world usage examples
- [Deployment](./vont/README.md#deployment) - Docker, Nginx, and more
- [Troubleshooting](./vont/README.md#troubleshooting) - Common issues and solutions

---

## 📁 Package Structure

### `@vont/core` Package

The core framework package (`vont/`):

- **CLI** - `vont dev`, `vont build`, `vont start` commands
- **Dev Server** - Hot reload for frontend and backend
- **Build System** - Optimized production builds
- **Route Registry** - Automatic API and page route detection
- **Type System** - Complete TypeScript definitions
- **Internal Files** - Auto-generated files in `.vont/` directory

### Example Application

Example application (`examples/koa-react-ts/`):

- Complete working example
- API routes demonstration
- Page components with Tailwind CSS
- Type-safe API integration

### `.vont/` Directory

Vont automatically creates a `.vont/` directory in your project root containing:

- **`client.tsx`** - Auto-generated client entry point
- Framework internal files (don't edit manually)

**Important**: Add `.vont/` to your `.gitignore`:
```gitignore
# Vont Framework generated files
.vont/
```

The `.vont/` directory is automatically:
- ✅ Created when running `vont dev` or `vont build`
- ✅ Cleaned up when the dev server stops
- ✅ Ignored by Git (if in .gitignore)
- ✅ Managed by the framework (no manual intervention needed)

---

## 🎯 Example Usage

### API Route

```typescript
// src/api/users.ts
import type { Context } from 'koa';

export const get = async (ctx: Context) => {
  ctx.body = { users: [] };
};

export const post = async (ctx: Context) => {
  const { name, email } = ctx.request.body;
  ctx.body = { id: Date.now(), name, email };
  ctx.status = 201;
};
```

### Page Component

```typescript
// src/pages/users.tsx
import React, { useState, useEffect } from 'react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data.users));
  }, []);
  
  return (
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

export default UsersPage;
```

### Configuration

```typescript
// vont.config.ts
import { defineConfig } from '@vont/core';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
export default defineConfig({
  port: 3000,
  apiPrefix: '/api',
  
  // Complete Vite configuration (use native Vite config)
  viteConfig: {
    plugins: [
      ...tailwindcss(),
      ...react(),
    ],
    // Customize other Vite settings if needed
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },
  
  build: {
    sourcemap: true,
    minify: true,
  },
});
});
```

---

## 🛠️ Development

### Setup

```bash
# Install dependencies
npm install

# Start demo in development mode
npm run dev

# Build vont package
npm run build:vont

# Build demo
npm run build:demo
```

### Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start demo in development mode |
| `npm run build` | Build both vont and demo |
| `npm run start` | Start demo in production mode |
| `npm run build:vont` | Build vont package only |
| `npm run build:demo` | Build demo only |

### Hot Reload Features

- **Frontend HMR** - React Fast Refresh for instant component updates
- **CSS Hot Update** - Style changes apply immediately
- **Backend Auto-Restart** - Server restarts automatically when code changes
- **API Hot Reload** - API routes reload dynamically without full restart

---

## 📊 Performance

| Feature | Traditional Approach | Vont |
|---------|---------------------|------|
| Startup Time | 10-30s (build + start) | < 2s (direct execution) |
| Frontend Updates | Manual refresh | HMR (instant) |
| CSS Changes | Full reload | Hot update (instant) |
| Backend Updates | Manual restart (~10s) | Auto-restart (~1-2s) |
| API Updates | Manual restart (~10s) | Hot reload (~500ms) |

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
```

### Environment Variables

```bash
PORT=8080 npm run start
HOST=0.0.0.0 npm run start
NODE_ENV=production npm run start
```

---

## 🗺️ Roadmap

- [ ] Server-Side Rendering (SSR)
- [ ] API route middleware composition
- [ ] Built-in authentication helpers
- [ ] Database adapters
- [ ] CLI project scaffolding (`vont create`)
- [ ] Plugin system
- [ ] WebSocket support
- [ ] GraphQL support

---

## 📝 Documentation Files

- [CODE_REVIEW_AND_OPTIMIZATION.md](./CODE_REVIEW_AND_OPTIMIZATION.md) - Code review and optimization plan
- [OPTIMIZATION_COMPLETE_REPORT.md](./OPTIMIZATION_COMPLETE_REPORT.md) - Detailed optimization report
- [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md) - Quick optimization overview
- [FINAL_SUMMARY.md](./FINAL_SUMMARY.md) - Final execution summary
- [README_UPDATE_SUMMARY.md](./README_UPDATE_SUMMARY.md) - README update details

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Single file should not exceed 500 lines
- Use explicit types, avoid `any` in TypeScript
- Maintain good component separation
- Follow existing code style

---

## 📄 License

MIT © [Your Name]

---

## 🔗 Links

- [Vont Core Package](./vont/) - Core framework package
- [Demo Application](./demo/) - Example application
- [Full Documentation](./vont/README.md) - Complete documentation
- GitHub: [github.com/yourusername/vont](https://github.com/yourusername/vont)
- Issues: [github.com/yourusername/vont/issues](https://github.com/yourusername/vont/issues)

---

## 🙏 Acknowledgments

Built with:
- [Koa](https://koajs.com/) - Backend framework
- [React](https://react.dev/) - Frontend library
- [Vite](https://vitejs.dev/) - Build tool (managed by Vont)
- [esbuild](https://esbuild.github.io/) - API compiler
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Chokidar](https://github.com/paulmillr/chokidar) - File watching
- [tsx](https://github.com/esbuild-kit/tsx) - TypeScript execution

---

## 📮 Support

- 📖 [Read the docs](./vont/README.md)
- 🐛 [Report bugs](https://github.com/yourusername/vont/issues)
- 💬 [Discussions](https://github.com/yourusername/vont/discussions)
- 📧 Email: support@vont.dev

---

**Made with ❤️ by the Vont Team**
