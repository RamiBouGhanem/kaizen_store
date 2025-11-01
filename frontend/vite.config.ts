import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // <-- relative paths for SPA assets, fixes refresh issues on non-root routes
  server: {
    proxy: {
      // Let frontend dev call backend without CORS pain
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist', // default build folder
    sourcemap: false, // optional: smaller build
  },
});
