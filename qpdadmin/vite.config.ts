import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
	plugins: [reactRouter(), tsconfigPaths(), svgr()],
	server: {
		port: 7022,
		strictPort: true, // 포트가 사용 중일 때 자동으로 다른 포트로 넘어가지 않게 설정
	},
});
