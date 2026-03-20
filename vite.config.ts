import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate source maps for production debugging
    sourcemap: false,
    // Target modern browsers — drops legacy polyfills
    target: 'es2020',
    // Chunk output
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    // Dev server settings
    port: 5173,
    strictPort: false,
  },
});
