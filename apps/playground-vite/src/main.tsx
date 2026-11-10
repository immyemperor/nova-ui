import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// One stylesheet: tokens, reset, layout classes, utilities. (Replaces @nova-ui/core/styles.css.)
import '@nova-ui/css/nova.css';
import './playground.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
