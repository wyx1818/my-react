import { createFiberFromElement, FiberNode } from './fiber';
import { ReactElementType } from 'shared/ReactTypes';
import { React_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostRoot } from './workTags';
import { Placement } from './fiberFlags';

function ChildReconciler(shouldTrackEffect: boolean) {
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		// 根据element
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;

		return fiber;
	}

	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostRoot, { content }, null);
		fiber.return = returnFiber;

		return fiber;
	}

	/**
	 * 插入单一的节点
	 * @param fiber
	 */
	function placeSingleChild(fiber: FiberNode) {
		// 标记副作用，并且首屏渲染
		if (
			shouldTrackEffect &&
			/** 刚创建的 fiber 是一个 wip fiber， 它的alternate 为 current = null */
			fiber.alternate === null
		) {
			fiber.flags |= Placement;
		}

		return fiber;
	}

	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 判断当前fiber 的类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case React_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.warn('为实现的reconcile类型', newChild);
					}
					break;
			}
		}
		// TODO: 多节点情况 ul > li*3
		// HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

		if (__DEV__) {
			console.warn('为实现的reconcile类型', newChild);
		}

		return null;
	};
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
