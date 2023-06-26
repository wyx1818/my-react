export function getCurrentTime(): number {
	return performance.now();
}

export function isObject(sth: unknown) {
	return typeof sth === 'object';
}

export function isFn(sth: unknown) {
	return typeof sth === 'function';
}
