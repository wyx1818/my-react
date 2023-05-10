/** 二进制位，代表优先级；越小，优先级越高 */
export type Lane = number;
/** 二进制位，Lane 的集；越靠右，优先级越高 */
export type Lanes = number;

export const SyncLane = /*  */ 0b0001;
export const NoLane = /*    */ 0b0000;

export const NoLanes = /*   */ 0b0000;

/**
 * 合并 lane
 * @param laneA
 * @param laneB
 * @return lanes
 */
export function mergeLanes(laneA: Lane, laneB: Lane): Lanes {
	return laneA | laneB;
}

/**
 * 根据触发情况不同，返回不同优先级
 */
export function requestUpdateLane(): Lane {
	return SyncLane;
}

/**
 * 从集合中取出优先级最高的 lane
 * @param lanes
 */
export function getHighestPriorityLane(lanes: Lanes): Lane {
	return lanes & -lanes;
}
