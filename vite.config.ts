import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Kalau deploy ke Netlify → biarkan base: '/'
  // Kalau ke GitHub Pages → ganti sesuai nama repo, misal '/Test-web/'
  base: process.env.VITE_BASE_PATH || '/',

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
    '**/*.woff2'
  ],
});