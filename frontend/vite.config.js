import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// [ref.] https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6173,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});