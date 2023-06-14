import {
	getTimeoutByPriorityLevel,
	PriorityLevel
} from './SchedulerPriorities';
import { getCurrentTime, isObject } from './shared';
import { push } from './SchedulerMinHeap';

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

export function scheduleCallback(
	priorityLevel: PriorityLevel,
	callback: Callback,
	options?: { delay: number }
) {
	const currentTIme = getCurrentTime();
	let startTime: number = currentTIme;
	if (isObject(options) && options !== null) {
		const delay = options?.delay;
		if (typeof delay === 'number' && delay > 0) {
			startTime = currentTIme + delay;
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

	if (startTime > currentTIme) {
		// 有延迟的任务
		newTask.sortIndex = startTime;
		push(timerQueue, newTask);
	} else {
		newTask.sortIndex = expirationTime;
		push(taskQueue, newTask);
	}
}
