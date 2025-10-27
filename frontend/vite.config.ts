import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Let frontend dev call backend without CORS pain:
      // any request starting with /api will be proxied to backend
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      // and serve uploads during dev too
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});
