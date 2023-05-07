import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [num, setNumber] = useState(80);

	if (num === 100) {
		// 判断条件中使用 hook， 报错
		useState(4);
	}

	const arr =
		num % 2 === 0
			? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
			: [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];

	const handleClick = () => {
		setNumber((pre) => pre + 1);
	};

	return (
		<div onClickCapture={handleClick}>
			<p key="1">{num}</p>
			<ul>{arr}</ul>
		</div>
	);
}

function Child() {
	return <span>big-react</span>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<App />
);
