import { FiberNode } from './fiber';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';

// 全局指针，执行正在工作的 FiberNode
let workInProgress: FiberNode | null = null;

// 初始化
function prepareRefreshStack(fiber: FiberNode) {
	workInProgress = fiber;
}
function renderRoot(root: FiberNode) {
	// 初始化
	prepareRefreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('workLoop 发生错误', e);
			workInProgress = null;
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	// 子 fiber 或者 null
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// 无子节点，开始归
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

// 遍历兄弟节点
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		const sibling = node.sibling;

		if (sibling !== null) {
			// 存在兄弟节点
			workInProgress = sibling;
			return;
		}

		// 不存在兄弟节点，处理父级
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
