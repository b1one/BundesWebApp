/// <reference types="vite/client" />

// Provide a lightweight ambient declaration when Vite types are not installed
declare module 'vite';

import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-vite',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
