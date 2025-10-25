import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
  },
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.mp4',
    '**/*.svg',
    '**/*.ttf',
    '**/*.woff',
    '**/*.woff2',
  ],
  resolve: {
    alias: {
      '/data/data/com.termux/files/home/folder/src': resolve(__dirname, 'src'),
    },
  },
});