import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// [ref.] https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '::',
    port: 6173,
    watch: {
      usePolling: true,
    },
    cors: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled'],
  },
});