import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [num, setNumber] = useState(95);

	if (num === 100) {
		// 判断条件中使用 hook， 报错
		useState(4);
	}
	const handleClick = () => {
		setNumber((pre) => pre + 1);
	};

	return (
		<div onClickCapture={handleClick}>
			<p>{num}</p>
		</div>
	);
}

function Child() {
	return <span>big-react</span>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<App />
);
