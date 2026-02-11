import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import styleX from 'vite-plugin-stylex';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [
        svgr({
            include: '**/*.svg?react',
        }),
        TanStackRouterVite({
            routesDirectory: resolve(__dirname, 'qpdweb/src/routes'),
            generatedRouteTree: resolve(__dirname, 'qpdweb/src/routeTree.gen.ts'),
        }),
        tsconfigPaths({
            projects: [resolve(__dirname, 'qpdweb/tsconfig.json')],
        }),
        react(),
        styleX(),
    ],
    resolve: {
        alias: {
            '~': resolve(__dirname, 'qpdweb/src'),
        },
    },
    publicDir: resolve(__dirname, 'qpdweb/public'),
    server: {
        port: 3000,
        host: true,
    },
});
