// 递归中的归
import { FiberNode } from './fiber';

/**
 * 向上归的过程
 * @param fiber
 */
export function completeWork(fiber: FiberNode): FiberNode | null {
	console.log(fiber);

	return null;
}
