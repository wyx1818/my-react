import * as path from 'path';
import * as fs from 'fs';

import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

/**
 * 解析包路径
 * @param pkgName 包名
 * @param isDist 是否产物
 * @returns {string}
 */
export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}

	return `${pkgPath}/${pkgName}`;
}

/**
 * 获取包信息
 * @param pkgName 包名
 * @returns {any}
 */
export function getPackageJSON(pkgName) {
	// ...包路径
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, { encoding: 'utf-8' });

	return JSON.parse(str);
}

export function getBaseRollupPlugin({ typescript = {} } = {}) {
	return [cjs(), ts(typescript)];
}
