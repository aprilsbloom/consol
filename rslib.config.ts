import { defineConfig, type LibConfig } from '@rslib/core';

const prod = process.env.NODE_ENV === 'production';
const bundle = true;
const basePath = './dist';
const sharedLib: LibConfig = {
	syntax: 'es2024',
	bundle,
	dts: {
		bundle,
		autoExtension: true,
	},
	output: {
		minify: {
			js: prod,
			jsOptions: {
				minimizerOptions: {
					compress: prod,
					mangle: prod,
					minify: prod,
					format: {
						comments: prod ? false : 'all',
					},
				},
			},
		},
	},
};

export default defineConfig({
	source: {
		entry: {
			index: './src/index.ts',
		},
		transformImport: [
			{
				libraryName: 'lodash',
				customName: 'lodash/{{ member }}',
			},
		],
	},
	lib: [
		{
			...sharedLib,
			format: 'esm',
			output: {
				distPath: { root: `${basePath}/esm` },
			},
		},
		{
			...sharedLib,
			format: 'cjs',
			output: {
				distPath: { root: `${basePath}/cjs` },
			},
		},
	],
});
