import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [num, setNumber] = useState(100);
	window.setNumber = setNumber;

	return num === 3 ? <Child /> : <div>{num}</div>;
}

function Child() {
	return <span>big-react</span>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<App />
);
