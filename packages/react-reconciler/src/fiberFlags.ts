export type Flags = number;

export const NoFlags = /*									*/ 0b00000000;
export const Placement = /*								*/ 0b00000001;
export const Update = /* 									*/ 0b00000010;
export const ChildDeletion = /*						*/ 0b00000100;
/** 当前 Fiber 本次更新存在副作用 */
export const PassiveEffect = /*						*/ 0b00001000;

export const MutationMask = Placement | Update | ChildDeletion;
export const PassiveMask = PassiveEffect | ChildDeletion;
