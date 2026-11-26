import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@kvui/css/kvui.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
