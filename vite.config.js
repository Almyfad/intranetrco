import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    https: true,
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      port: 4200, // Remplacez par votre nom d'hôte si différent
    },
  },
});