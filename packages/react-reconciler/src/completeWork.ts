// 递归中的归
import { FiberNode } from './fiber';

export function completeWork(fiber: FiberNode): FiberNode | null {
	console.log(fiber);

	return null;
}
