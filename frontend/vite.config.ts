/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: 'src/setupTests.js',
    testTimeout: 10000,
  },
  plugins: [react()],
  // base: '/app_dist',
  build: {
    outDir: 'app_dist',
  },
});
