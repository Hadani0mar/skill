import './src/clock-install'
import { createRoot } from 'react-dom/client'
import './kit/stageshow.css'
import './src/style.css'
import App from './src/App'
createRoot(document.getElementById('root')!).render(<App />)
;(window as any).__mounted = true
