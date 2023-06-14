import {
	getTimeoutByPriorityLevel,
	PriorityLevel
} from './SchedulerPriorities';
import { getCurrentTime, isObject } from './shared';
import { peek, pop, push } from './SchedulerMinHeap';

type Callback = (...arg: any[]) => void; // (args: any) => void | any;

export interface Task {
	id: number;
	callback: Callback;
	priorityLevel: PriorityLevel;
	/** 任务开始调度的理论时间 */
	startTime: number;
	/** 过期时间 */
	expirationTime: number;
	sortIndex: number;
}

/** 任务储存，最小堆 */
const taskQueue: Array<Task> = [];
/** delay 的任务，最小堆 */
const timerQueue: Array<Task> = [];

let taskIdCounter = 1;

/** 是否在倒计时标记 */
let isHostTimeoutScheduled = false;
/** 在调度任务 */
let isHostCallbackScheduled = false;

let taskTimeoutID = -1;

function cancelHostTimeout() {
	clearTimeout(taskTimeoutID);
	taskTimeoutID = -1;
}
function requestHostTimeout(callback: Callback, ms: number) {
	taskTimeoutID = setTimeout(() => {
		callback(getCurrentTime());
	}, ms);
}

/**
 * 检查 timerQueue 中是否有任务到期，到期了就把当前有效任务移动到 taskQueue 中
 */
function advanceTimers(currentTime: number) {
	let timer: Task = peek(timerQueue) as Task;
	while (timer !== null) {
		if (timer.callback === null) {
			// 无效任务直接移出
			pop(timerQueue);
		} else if (timer.startTime <= currentTime) {
			pop(timerQueue);
			timer.sortIndex = timer.expirationTime;
			push(taskQueue, timer);
		} else {
			return;
		}
		// 继续查找下个任务
		timer = peek(timerQueue) as Task;
	}
}

/**
 * 倒计时触发
 * @param currentTime
 */
function handleTimeout(currentTime: number) {
	isHostTimeoutScheduled = false;
	advanceTimers(currentTime);

	if (!isHostCallbackScheduled) {
		if (peek(taskQueue) !== null) {
			// 有任务，开始调度
			isHostCallbackScheduled = true;
			requestHostCallback(flushWork);
		} else {
			// 没有任务，去 timerQueue 查找
			const firstTimer = peek(timerQueue) as Task;
			if (firstTimer !== null) {
				requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
			}
		}
	}
}

/**
 * TODO: 调度主线程任务
 * @param callbak
 */
function requestHostCallback(callbak: Callback) {}

/**
 * TODO
 */
function flushWork() {}

export function scheduleCallback(
	priorityLevel: PriorityLevel,
	callback: Callback,
	options?: { delay: number }
) {
	const currentTime = getCurrentTime();
	let startTime: number = currentTime;
	if (isObject(options) && options !== null) {
		const delay = options?.delay;
		if (typeof delay === 'number' && delay > 0) {
			startTime = currentTime + delay;
		}
	}

	const timout = getTimeoutByPriorityLevel(priorityLevel);
	const expirationTime = startTime + timout;

	const newTask: Task = {
		id: taskIdCounter++,
		callback,
		priorityLevel,
		startTime, // 任务开始调度的理论时间
		expirationTime, // 过期时间
		sortIndex: -1
	};

	if (startTime > currentTime) {
		// 有延迟的任务
		newTask.sortIndex = startTime;
		push(timerQueue, newTask);
		if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
			// 开启新的任务倒计时前，检测是否有任务在倒计时
			if (isHostTimeoutScheduled) {
				cancelHostTimeout();
			} else {
				isHostTimeoutScheduled = true;
			}
			requestHostTimeout(handleTimeout, startTime - currentTime);
		}
	} else {
		newTask.sortIndex = expirationTime;
		push(taskQueue, newTask);
	}
}
