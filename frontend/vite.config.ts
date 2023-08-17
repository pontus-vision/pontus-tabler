import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
  },
  // base: '/app_dist',
  build: {
    outDir: 'app_dist',
  },
});
