import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (
            id.includes('react-activity-calendar') ||
            id.includes('recharts') ||
            id.includes('d3-')
          ) {
            return 'charts';
          }

          if (id.includes('framer-motion') || id.includes('lenis')) {
            return 'motion';
          }

          if (id.includes('react-markdown') || id.includes('remark-') || id.includes('mdast')) {
            return 'markdown';
          }

          return 'vendor';
        },
      },
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
