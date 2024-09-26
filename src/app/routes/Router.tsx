import { Router, useACLGuard, useTokenGuard } from '@laser-pro/router';
import { Suspense, createElement, lazy, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';

import AppExceptionRoute from './exception/Exception';
import AppHomeRoute from './home/Home';
import AppLayout from './layout/Layout';
import AppLoginRoute from './login/Login';
import { AppFCPLoader } from '../components';
import { ROUTES_ACL } from '../configs/acl';
import { TITLE_OPTIONS } from '../configs/app';
import { LOGIN_PATH, PREV_ROUTE_KEY } from '../configs/router';
import { TOKEN } from '../core';

const ROUTES = {
  '/dashboard/echarts': lazy(() => import('./dashboard/echarts/ECharts')),
  '/list/standard-table': lazy(() => import('./list/standard-table/StandardTable')),
  '/list/standard-table/:id': lazy(() => import('./list/standard-table/detail/Detail')),
  '/test/acl': lazy(() => import('./test/acl/ACL')),
  '/test/http': lazy(() => import('./test/http/Http')),
};

interface AppRouteProps {
  path?: keyof typeof ROUTES;
  element?: React.FC;
}
function AppRoute(props: AppRouteProps) {
  const { path, element } = props;

  return element ? createElement(element) : <Suspense fallback={<AppFCPLoader />}>{createElement(ROUTES[path!])}</Suspense>;
}

const AppRouter = memo(() => {
  const location = useLocation();
  const { t } = useTranslation();

  const ACLGuard = useACLGuard('/exception/403');
  const tokenGuard = useTokenGuard(TOKEN.value ? TOKEN.value.expired : true, LOGIN_PATH, { [PREV_ROUTE_KEY]: location });

  return (
    <Router
      routes={[
        {
          path: LOGIN_PATH,
          element: <AppRoute element={AppLoginRoute} />,
          data: {
            title: t('Login', { ns: 'title' }),
          },
        },
        {
          path: '/',
          element: <AppRoute element={AppHomeRoute} />,
          data: {
            canActivate: [tokenGuard],
          },
        },
        {
          element: <AppLayout />,
          data: {
            canActivate: [tokenGuard],
            canActivateChild: [tokenGuard],
          },
          children: [
            {
              path: 'dashboard',
              children: [
                {
                  index: true,
                  element: <Navigate to="/exception/404" replace />,
                },
                {
                  path: 'echarts',
                  element: <AppRoute path="/dashboard/echarts" />,
                  data: {
                    title: t('ECharts', { ns: 'title' }),
                    acl: ROUTES_ACL['/dashboard/echarts'],
                    canActivate: [ACLGuard],
                  },
                },
              ],
            },
            {
              path: 'list',
              children: [
                {
                  index: true,
                  element: <Navigate to="/exception/404" replace />,
                },
                {
                  path: 'standard-table',
                  element: <AppRoute path="/list/standard-table" />,
                  data: {
                    title: t('Standard table', { ns: 'title' }),
                    acl: ROUTES_ACL['/list/standard-table'],
                    canActivate: [ACLGuard],
                  },
                },
                {
                  path: 'standard-table/:id',
                  element: <AppRoute path="/list/standard-table/:id" />,
                  data: {
                    title: t('Device detail', { ns: 'title' }),
                    acl: ROUTES_ACL['/list/standard-table/:id'],
                    canActivate: [ACLGuard],
                  },
                },
              ],
            },
            {
              path: 'test',
              children: [
                {
                  index: true,
                  element: <Navigate to="/exception/404" replace />,
                },
                {
                  path: 'acl',
                  element: <AppRoute path="/test/acl" />,
                  data: {
                    title: t('ACL', { ns: 'title' }),
                    acl: ROUTES_ACL['/test/acl'],
                    canActivate: [ACLGuard],
                  },
                },
                {
                  path: 'http',
                  element: <AppRoute path="/test/http" />,
                  data: {
                    title: t('Http', { ns: 'title' }),
                    acl: ROUTES_ACL['/test/http'],
                    canActivate: [ACLGuard],
                  },
                },
              ],
            },
          ],
        },
        {
          path: '/exception/:status',
          element: <AppRoute element={AppExceptionRoute} />,
          data: (params) => ({
            title: params.status,
          }),
        },
        {
          path: '*',
          element: <Navigate to="/exception/404" replace />,
        },
      ]}
      titleOptions={TITLE_OPTIONS}
    />
  );
});

export default AppRouter;
