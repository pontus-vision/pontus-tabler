/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: 'src/setupTests.js',
    testTimeout: 20000,
    // environmentOptions: {
    //   coverage: true,
    //   testPathIgnorePatterns: [
    //     '.*.js',
    //     '.*d.ts',
    //     '.*http.ts',
    //     '.*pv-response.ts',
    //     '.*test-utils.ts',
    //   ],
    // },
    testNamePattern: 'TableViews',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  plugins: [react()],
  // base: '/app_dist',
  build: {
    outDir: 'app_dist',
  },
});
