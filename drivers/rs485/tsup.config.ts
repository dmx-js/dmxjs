import {defineConfig} from 'tsup';

export default defineConfig({
	clean: true,
	entry: ['./src/index.ts', './src/worker.ts'],
	format: ['cjs', 'esm'],
	dts: true,
});
