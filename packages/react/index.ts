import { jsxDEV, jsx, isValidElement as isValidElementFn } from './src/jsx';
import currentDispatcher, {
	Dispatcher,
	resolveDispatcher
} from './src/currentDispatcher';

export const useState: Dispatcher['useState'] = (initState) => {
	const dispatcher = resolveDispatcher();

	return dispatcher.useState(initState);
};

// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
	currentDispatcher
};

// React
export const version = '0.0.0';
// TODO: 根据环境区分使用 jsx/jsxDEV
export const createElement = jsx;

export const isValidElement = isValidElementFn;
