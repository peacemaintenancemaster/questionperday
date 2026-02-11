import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import styleX from 'vite-plugin-stylex';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: resolve(__dirname),
    plugins: [
        // svgr을 react()보다 앞에 두는 것이 안전합니다.
        svgr({
            // ?react 접미사가 붙은 경우에만 React 컴포넌트로 변환하도록 설정
            include: '**/*.svg?react',
        }),
        TanStackRouterVite({}),
        tsconfigPaths(),
        react(),
        styleX(),
    ],
    resolve: {
        alias: {
            // tsconfig.json의 paths 설정과 일치하도록 경로 별칭 설정
            '~': resolve(__dirname, './src'),
        },
    },
});
