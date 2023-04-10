import { Action } from 'shared/ReactTypes';
import { Dispatch } from 'react/src/currentDispatcher';

/**
 * 代表更新的数据结构
 */
export interface Update<State> {
	action: Action<State>;
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
 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
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
	updateQueue.shared.pending = update;
};

/**
 * 消费 update
 * @param baseState 初始状态
 * @param pendingUpdate 消费的状态
 * @return 全新的状态
 */
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { /** 更新完成以后，新的 state */ memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// baseState 1 update (x) => 4x -> memoizedState 4
			result.memoizedState = action(baseState);
		} else {
			// baseState 1 update 2 -> memoizedState 2
			result.memoizedState = action;
		}
	}

	return result;
};
