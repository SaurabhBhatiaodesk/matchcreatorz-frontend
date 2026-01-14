import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig({
	plugins: [
		react(),
		viteCompression({
			algorithm: 'gzip',
			deleteOriginFile: false,
		}),
	],
	resolve: {
		alias: {
			assets: path.resolve(__dirname, 'src/assets'),
			components: path.resolve(__dirname, 'src/Components'),
			constants: path.resolve(__dirname, 'src/constants'),
			layouts: path.resolve(__dirname, 'src/layouts'),
			pages: path.resolve(__dirname, 'src/pages'),
			routing: path.resolve(__dirname, 'src/routing'),
			utils: path.resolve(__dirname, 'src/utils'),
			services: path.resolve(__dirname, 'src/services'),
			store: path.resolve(__dirname, 'src/store'),
			styles: path.resolve(__dirname, 'src/styles'),
		},
	},
	build: {
		outDir: './build',
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				},
			},
		},
	},
});
