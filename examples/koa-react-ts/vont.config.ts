import { defineConfig } from '@vont/core';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

/**
 * Vont Framework Configuration - Minimal Example
 * 
 * This is a minimal configuration that only overrides what's necessary.
 * Vont will use sensible defaults for all other options.
 */
export default defineConfig({
  // Server settings
  port: 3000,
  host: '0.0.0.0',

  viteConfig: {
    plugins: [
      tailwindcss(),
      react(),
    ],
  },

});
