import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, Navigate, useLocation } from 'react-router';

// eslint-disable-next-line import/order
import './index.css';
import App from './app/App';
import { HASH } from './app/configs/router';
import { startup } from './startup';

// eslint-disable-next-line react-refresh/only-export-components
function Main({ path }: { path?: string }) {
  const location = useLocation();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, [location]);

  return path && !mounted.current ? <Navigate to={path} replace /> : <App />;
}

startup.then((path) => {
  const Router = HASH ? HashRouter : BrowserRouter;
  createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
      <Router>
        <Main path={path} />
      </Router>
    </StrictMode>,
  );
});
