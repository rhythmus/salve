import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

export default defineConfig({
    plugins: [viteSingleFile()],
    build: {
        outDir: '../../website',
        emptyOutDir: true,
        assetsInlineLimit: Infinity,
        cssCodeSplit: false,
        modulePreload: { polyfill: false },
    },
    base: './',
    resolve: {
        alias: {
            '@salve/core': path.resolve(__dirname, '../core/src'),
            '@salve/devtools': path.resolve(__dirname, '../devtools/src'),
            '@salve/registry': path.resolve(__dirname, '../registry/src'),
            '@salve/types': path.resolve(__dirname, '../types/src'),
            '@salve/calendars-gregorian': path.resolve(__dirname, '../calendars-gregorian/src'),
            '@salve/calendars-hijri': path.resolve(__dirname, '../calendars-hijri/src'),
            '@salve/calendars-pascha': path.resolve(__dirname, '../calendars-pascha/src'),
            '@salve/calendars-specialty': path.resolve(__dirname, '../calendars-specialty/src'),
            '@desquared/greek-vocative-name': path.resolve(__dirname, '../../node_modules/@desquared/greek-vocative-name/dist/index.js'),
        },
    },
    server: {
        fs: {
            allow: ['..'],
        },
    },
});
