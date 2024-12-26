/// <reference types='vitest' />
import path from 'node:path';

import react from '@vitejs/plugin-react';
import sass from 'sass';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  root: __dirname,
  cacheDir: './node_modules/.vite/laser-admin',
  resolve: {
    alias: {
      '~styles': path.join(__dirname, './src/styles'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        logger: sass.Logger.silent,
      },
    },
  },
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), svgr()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist/laser-admin',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
