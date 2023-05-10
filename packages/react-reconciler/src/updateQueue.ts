import { Action } from 'shared/ReactTypes';
import { Dispatch } from 'react/src/currentDispatcher';
import { Lane } from './fiberLanes';

/**
 * 代表更新的数据结构
 */
export interface Update<State> {
	action: Action<State>;
	lane: Lane;
	next: Update<any> | null;
}

/**
 * 消费 update 的数据结构
 */
export interface UpdateQueue<State> {
	// 为了在 wip 中共用 updateQueue
	shared: {
		pending: Update<State> | null;
	};
	dispatch: Dispatch<State> | null;
}

/**
 * 创建更新实例
 * @param action
 * @param lane 优先级
 */
export const createUpdate = <State>(
	action: Action<State>,
	lane: Lane
): Update<State> => {
	return {
		action,
		lane,
		next: null
	};
};

/**
 * 创建更新队列
 */
export const createUpdateQueue = <State>(): UpdateQueue<State> => {
	// 这样设计， 可以在 wip 和 current 中公用一个 updateQueue
	return {
		shared: {
			pending: null
		},
		dispatch: null
	};
};

/**
 * 将 update 插入到 updateQueue
 * @param updateQueue 更新队列
 * @param update 更新实例
 */
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	// 批处理，更改为环状链表结构
	// 表头的 next 指向第一个更新
	// 当表尾的 next 指向表头时，完成批处理
	const pending = updateQueue.shared.pending;

	if (pending === null) {
		// step1 a -> a
		update.next = update;
	} else {
		// 新状态的 next 指向表头（第一个节点）
		// step2 b -> a -> a
		// step3 c -> a -> b -> a
		update.next = pending.next;
		// 表尾指向新状态
		// step2 b -> a -> b
		// step3 c -> a -> b -> c
		pending.next = update;
	}

	updateQueue.shared.pending = update;
};

/**
 * 消费 update
 * @param baseState 初始状态
 * @param pendingUpdate 消费的状态
 * @param renderLane 更新优先级
 * @return 全新的状态
 */
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null,
	renderLane: Lane
): { /** 更新完成以后，新的 state */ memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingUpdate !== null) {
		// 第一个 update
		const first = pendingUpdate.next;
		let pending = pendingUpdate.next as Update<any>;

		do {
			const updateLane = pending.lane;
			if (updateLane === renderLane) {
				const action = pendingUpdate.action;
				if (action instanceof Function) {
					// baseState 1 update (x) => 4x -> memoizedState 4
					baseState = action(baseState);
				} else {
					// baseState 1 update 2 -> memoizedState 2
					baseState = action;
				}
			} else {
				if (__DEV__) {
					console.error(
						'当前都为同步更新，不应该进入updateLane !== renderLane这里'
					);
				}
			}

			pending = pending.next as Update<any>;
		} while (pending !== first);
	}
	result.memoizedState = baseState;

	return result;
};
