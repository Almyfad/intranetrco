import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    https: true,
    hmr: {
      protocol: 'wss',
      port: 4201, 
    },
  },
});