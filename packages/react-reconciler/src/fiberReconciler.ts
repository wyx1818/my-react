import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import { Container } from 'hostConfig';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

/**
 * 创建应用根节点
 * @param container 宿主容器
 */
export function createContainer(container: Container) {
	/**
	 *      fiberRootNode
	 *  current ↓ ↑ stateNode
	 *     hostRootFiber
	 */
	// 创建 hostRootFiber
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	// 链接 fiberRootNode 和 hostRootFiber
	const root = new FiberRootNode(container, hostRootFiber);

	hostRootFiber.updateQueue = createUpdateQueue();

	return root;
}

export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element);

	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);

	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
