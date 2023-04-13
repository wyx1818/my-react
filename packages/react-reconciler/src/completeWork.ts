// 递归中的归
import { FiberNode } from './fiber';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import {
	appendInitialChild,
	Container,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { NoFlags, Update } from './fiberFlags';
import { updateFiberProps } from 'react-dom/src/SyntheticEvent';

function markUpdate(fiber: FiberNode) {
	fiber.flags |= Update;
}

/**
 * 向上归的过程
 * @param wip
 */
export function completeWork(wip: FiberNode): FiberNode | null {
	const newProps = wip.pendingProps;
	const current = wip.alternate;

	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.alternate) {
				// update
				updateFiberProps(wip.stateNode, newProps);
				// TODO: 遍历对比 newProps
				// 1. props 是否变化
				// 2. 变了 Update flag
			} else {
				// 1. 构建 DOM
				// 2. 将 DOM 插入到 DOM 树中
				// const instance = createInstance(wip.type, newProps);
				const instance = createInstance(wip.type, newProps);
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);

			return null;
		case HostText:
			if (current !== null && wip.alternate) {
				// update
				const oldText = current.memoizedProps.content;
				const newText = newProps.content;

				if (oldText !== newText) {
					markUpdate(wip);
				}
			} else {
				// 1. 构建 DOM
				// 2. 将 DOM 插入到 DOM 树中
				const instance = createTextInstance(newProps.content, newProps);
				wip.stateNode = instance;
			}

			bubbleProperties(wip);

			return null;
		case HostRoot:
			bubbleProperties(wip);

			return null;
		case FunctionComponent:
			bubbleProperties(wip);

			return null;
		default:
			if (__DEV__) {
				console.warn('未实现的completeWork情况', wip);
			}
			break;
	}

	return null;
}

function appendAllChildren(parent: Container, wip: FiberNode) {
	let node = wip.child;

	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			// 向下继续遍历子级
			node.child.return = node;
			node = node.child;
			continue;
		}

		// 终止情况
		if (node === wip) {
			return;
		}

		// 无兄弟节点，向上
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}

			node = node.return;
		}

		// 遍历兄弟节点
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

/**
 * 冒泡子节点，已经子节点兄弟节点的副作用
 * @param wip
 */
function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}

	wip.subtreeFlags |= subtreeFlags;
}
