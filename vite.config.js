"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_1 = require("@vitejs/plugin-react");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
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
