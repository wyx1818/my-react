// 递归过程中的递阶段
import { FiberNode } from './fiber';

export function beginWork(fiber: FiberNode): FiberNode | null {
	// 子 fiberNode
	console.log(fiber);
	return null;
}
