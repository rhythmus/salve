import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@salve/core': path.resolve(__dirname, '../core/src'),
            '@salve/devtools': path.resolve(__dirname, '../devtools/src'),
            '@salve/registry': path.resolve(__dirname, '../registry/src'),
            '@salve/types': path.resolve(__dirname, '../types/src'),
            '@salve/calendars-gregorian': path.resolve(__dirname, '../calendars-gregorian/src'),
            '@desquared/greek-vocative-name': path.resolve(__dirname, '../../node_modules/@desquared/greek-vocative-name/dist/index.js'),
        },
    },
    server: {
        fs: {
            allow: ['..'],
        },
    },
});
