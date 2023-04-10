// eslint-disable-next-line
const { defaults } = require('jest-config');

/** @type {import('jest').Config} */
const config = {
	...defaults,
	rootDir: process.cwd(),
	modulePathIgnorePatterns: ['<rootDir>/.history'],
	moduleDirectories: [
		// 对于 React ReactDom
		'dist/node_modules',
		// 对于三方依赖
		...defaults.moduleDirectories
	],
	testEnvironment: 'jsdom'
};

module.exports = config;
