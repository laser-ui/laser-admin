import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, Navigate, useLocation } from 'react-router';

// eslint-disable-next-line import/order
import './index.css';
import App from './app/App';
import { HASH } from './app/configs/router';
import { startup } from './startup';
import { QUERY_CLIENT } from './vars';

let initNavigationCompleted = (currentPath: string, initialPath?: string): boolean => {
  if (initialPath) {
    if (initialPath === currentPath) {
      initNavigationCompleted = () => {
        return true;
      };
    } else {
      return false;
    }
  }
  return true;
};
// eslint-disable-next-line react-refresh/only-export-components
function Main({ path }: { path?: string }) {
  const location = useLocation();

  return initNavigationCompleted(location.pathname, path) ? <App /> : <Navigate to={path!} replace />;
}

startup.then((path) => {
  const Router = HASH ? HashRouter : BrowserRouter;
  createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
      <QueryClientProvider client={QUERY_CLIENT}>
        <Router>
          <Main path={path} />
        </Router>
      </QueryClientProvider>
    </StrictMode>,
  );
});
