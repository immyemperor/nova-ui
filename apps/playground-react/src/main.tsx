import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@nova-ui/css/nova.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
