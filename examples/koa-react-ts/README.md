# Vont Demo Application

This is a demo application showcasing the Vont Framework capabilities.

## Features

- 🎨 Modern UI with Tailwind CSS v4
- ⚡ File-based routing for API and pages
- 🔧 Full TypeScript support
- 🔄 Hot module replacement

## Getting Started

### Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Production

```bash
npm run build
npm start
```

## Project Structure

```
koa-react-ts/
├── src/
│   ├── api/              # API routes
│   │   └── users/        # User API endpoints
│   ├── pages/            # Frontend pages
│   │   ├── index.tsx     # Home page
│   │   ├── about.tsx     # About page
│   │   └── users.tsx     # Users page
│   ├── lib/              # Utility libraries
│   ├── styles/           # Global styles
│   └── types/            # TypeScript types
├── index.html            # HTML template
├── vont.config.ts        # Vont configuration (full example)
├── vont.config.minimal.ts # Minimal configuration example
├── vont.config.production.ts # Production configuration example
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

> **Note**: No `vite.config.ts` needed! All Vite configuration is managed through `vont.config.ts`'s `viteConfig` field.

## API Routes

### GET /api/users
Get all users

### POST /api/users
Create a new user

Body: `{ "name": string, "email": string }`

### GET /api/users/:id
Get user by ID

## Pages

- `/` - Home page with framework overview
- `/about` - About the framework
- `/users` - User management demo

## Technologies

- **Backend**: Koa 2.x
- **Frontend**: React 18 + React Router 6
- **Build Tool**: Vite 5 (managed by Vont)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Framework**: Vont (File-based routing + HMR)

## Configuration

This example includes three configuration files demonstrating different use cases:

### 1. `vont.config.ts` (Full Example)

Complete configuration with all available options and detailed comments:

```typescript
import { defineConfig } from 'vont';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  port: 3000,
  apiPrefix: '/api',
  vitePlugins: [tailwindcss()],
  build: {
    sourcemap: true,
    minify: true,
  },
  // ... and more options
});
```

### 2. `vont.config.minimal.ts` (Minimal)

Minimal configuration that only overrides necessary settings:

```typescript
export default defineConfig({
  port: 3000,
  vitePlugins: [tailwindcss(), react()],
});
```

### 3. `vont.config.production.ts` (Production)

Optimized configuration for production deployments:

```typescript
export default defineConfig({
  port: parseInt(process.env.PORT || '8080'),
  build: {
    sourcemap: false,
    minify: true,
  },
  viteConfig: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  },
});
```

### Using Different Configs

```bash
# Use default vont.config.ts
npm run dev

# Use production config
cp vont.config.production.ts vont.config.ts
npm run build

# Use minimal config
cp vont.config.minimal.ts vont.config.ts
npm run dev
```

## Learn More

See the main README at the project root for more information about the Vont Framework.

