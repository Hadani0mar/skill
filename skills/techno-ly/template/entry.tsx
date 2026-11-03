import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import './kit/stageshow.css';
import './src/style.css';
import App from './src/App';
const root = createRoot(document.getElementById('root')!);
(window as any).__seek = (t: number) => { flushSync(() => root.render(<App t={t} />)); };
(window as any).__seek(+(new URLSearchParams(location.search).get('t') || 0));
(window as any).__mounted = true;
