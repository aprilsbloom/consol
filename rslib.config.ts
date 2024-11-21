import { defineConfig, type LibConfig } from '@rslib/core';

const bundle = true;
const sharedLib: LibConfig = {
	syntax: 'es2024',
	bundle,
	dts: {
		bundle,
		autoExtension: true,
	},
	output: {
		distPath: {
			root: './dist',
		},
		minify: {
			js: true,
			jsOptions: {
				minimizerOptions: {
					compress: true,
					mangle: true,
					minify: true,
				}
			}
		}
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
		},
		{
			...sharedLib,
			format: 'cjs',
		},
	]
});
