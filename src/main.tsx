import { StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import App from './app/App';
import { HASH } from './app/configs/router';
import { startup } from './startup';

startup.then(() => {
  createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>{createElement(HASH ? HashRouter : BrowserRouter, { children: <App /> })}</StrictMode>,
  );
});
