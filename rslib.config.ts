import { defineConfig, type LibConfig } from '@rslib/core';

const sharedLib: LibConfig = {
	syntax: 'es2024',
	dts: {
		bundle: true,
	},
};

export default defineConfig({
	lib: [
		{
			...sharedLib,
			format: 'esm',
			output: {
				distPath: {
					root: './dist/esm',
				},
			},
		},
		{
			...sharedLib,
			format: 'cjs',
			output: {
				distPath: {
					root: './dist/cjs',
				},
			},
		},
	]
});
