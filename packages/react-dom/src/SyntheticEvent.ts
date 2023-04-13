import { Container } from 'hostConfig';
import { Props } from 'shared/ReactTypes';

export const elementPropsKey = '__props';
const validEventTypeList = ['click'];

type EventCallback = (e: Event) => void;

interface SyntheticEvent extends Event {
	__stopPropagation: boolean;
}

interface Paths {
	/** 捕获阶段的事件 */
	capture: EventCallback[];
	/** 冒泡阶段的事件 */
	bubble: EventCallback[];
}
export interface DOMElement extends Element {
	[elementPropsKey]: Props;
}

export function updateFiberProps(node: DOMElement, props: Props) {
	node[elementPropsKey] = props;
}

export function initEvent(container: Container, eventType: string) {
	if (!validEventTypeList.includes(eventType)) {
		console.warn('当前不支持', eventType, '事件');
		return;
	}
	if (__DEV__) {
		console.log('初始化事件', eventType);
	}

	container.addEventListener(eventType, (e) => {
		dispatchEvent(container, eventType, e);
	});
}

function createSyntheticEvent(e: Event) {
	const syntheticEvent = e as SyntheticEvent;
	syntheticEvent.__stopPropagation = false;
	const originStopPropagation = e.stopPropagation;

	syntheticEvent.stopPropagation = () => {
		syntheticEvent.__stopPropagation = true;
		if (originStopPropagation) {
			originStopPropagation();
		}
	};

	return syntheticEvent;
}

function dispatchEvent(container: Container, eventType: string, e: Event) {
	const targetElement = e.target;
	if (targetElement === null) {
		console.warn('事件不存在 target', e);
		return;
	}
	// 1. 收集沿途的事件
	const { bubble, capture } = collectPaths(
		targetElement as DOMElement,
		container,
		eventType
	);
	// 2. 构造合成事件
	const se = createSyntheticEvent(e);
	// 3. 遍历 capture
	triggerEventFlow(capture, se);
	// 3. 遍历 bubble
	if (!se.__stopPropagation) {
		triggerEventFlow(bubble, se);
	}
}

function triggerEventFlow(paths: EventCallback[], se: SyntheticEvent) {
	for (let i = 0; i < paths.length; i++) {
		const callback = paths[i];
		callback.call(null, se);

		if (se.__stopPropagation) {
			break;
		}
	}
}

function getEventCallbackNameFromEventType(
	eventType: string
): string[] | undefined {
	return {
		click: ['onClickCapture', 'onClick']
	}[eventType];
}

function collectPaths(
	targetElement: DOMElement,
	container: Container,
	eventType: string
) {
	const paths: Paths = {
		capture: [],
		bubble: []
	};

	while (targetElement && targetElement !== container) {
		// 收集
		const elementProps = targetElement[elementPropsKey];
		if (elementProps) {
			// click -> onClick onClickCapture
			const callbackNameList = getEventCallbackNameFromEventType(eventType);
			if (callbackNameList) {
				callbackNameList.forEach((callbackName, i) => {
					const eventCallback = elementProps[callbackName];
					if (eventCallback) {
						/**
						 * main onClick onClickCapture
						 * 	div onClick onClickCapture
						 * 		p onClick (targetElement)
						 */
						if (i === 0) {
							// capture 从上往下 [main.onClickCapture, div.onClickCapture]
							paths.capture.unshift(eventCallback);
						} else {
							// bubble 从下网上 [p.onClick, div.onClick, main.onClick]
							paths.bubble.push(eventCallback);
						}
					}
				});
			}
		}
		targetElement = targetElement.parentNode as DOMElement;
	}

	return paths;
}
