export function getCurrentTime(): number {
	return performance.now();
}

export function isObject(sth: any) {
	return typeof sth === 'object';
}
