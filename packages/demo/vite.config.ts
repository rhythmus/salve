import { viteSingleFile } from 'vite-plugin-singlefile';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

export default {
    plugins: [commonjs(), viteSingleFile()],
    resolve: {
        alias: {
            '@desquared/greek-vocative-name': path.resolve(__dirname, '../../node_modules/@desquared/greek-vocative-name/dist/index.js')
        }
    },

    build: {
        outDir: '../../website',
        emptyOutDir: true,
        assetsInlineLimit: Infinity,
        cssCodeSplit: false,
        minify: 'terser',
        terserOptions: {
            format: { comments: false },
            compress: { drop_console: false } // Keep minimal logs
        },
        modulePreload: { polyfill: false },
        commonjsOptions: {
            include: [/node_modules/],
        }
    },
    base: './',
    optimizeDeps: {
        include: ['@desquared/greek-vocative-name']
    },
    server: {
        fs: {
            allow: ['..'],
        },
    },
}
