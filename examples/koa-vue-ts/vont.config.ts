import { defineConfig } from 'vont';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

/**
 * Vont Framework Configuration - Vue Example
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
      vue(),
    ],
  },

});

