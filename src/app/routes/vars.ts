import type { RouteStateContextData } from './types';

import { createContext, lazy } from 'react';

export const RouteStateContext = createContext<RouteStateContextData>({
  matchRoutes: null,
});

export const ROUTES = {
  '/dashboard/echarts': lazy(() => import('./dashboard/echarts/ECharts')),
  '/list/standard-table': lazy(() => import('./list/standard-table/StandardTable')),
  '/list/standard-table/:id': lazy(() => import('./list/standard-table/detail/Detail')),
  '/test/acl': lazy(() => import('./test/acl/ACL')),
  '/test/http': lazy(() => import('./test/http/Http')),
};
