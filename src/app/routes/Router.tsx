import { Router, useACLGuard, useTokenGuard } from '@laser-pro/router';
import { isFunction, isUndefined } from 'lodash';
import { Fragment, Suspense, lazy, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useParams } from 'react-router';

import { AppFCPLoader } from '../components';
import AppExceptionRoute from './exception/Exception';
import AppHomeRoute from './home/Home';
import AppLayout from './layout/Layout';
import AppLoginRoute from './login/Login';
import { ROUTES_ACL } from '../configs/acl';
import { APP_ROUTE_NAVIGATION, LOGIN_PATH, PREV_ROUTE_KEY } from '../configs/router';
import { useToken } from '../core';

function createRoute(element: any, rerender?: () => React.Key | undefined): React.ReactElement {
  const useRerender = (): React.Key | undefined => {
    const location = useLocation();
    if (location.state && location.state[APP_ROUTE_NAVIGATION]) {
      const key = location.state[APP_ROUTE_NAVIGATION];
      if (!isUndefined(key)) {
        return key;
      }
    }

    if (rerender) {
      const key = rerender();
      if (!isUndefined(key)) {
        return key;
      }
    }
  };
  const Component = isFunction(element) ? lazy(element) : null;
  const Route = () => {
    const key = useRerender();
    return (
      <Fragment key={key}>
        {Component ? (
          <Suspense fallback={<AppFCPLoader />}>
            <Component />
          </Suspense>
        ) : (
          element
        )}
      </Fragment>
    );
  };
  return <Route />;
}
const ROUTES = {
  [LOGIN_PATH]: createRoute(<AppLoginRoute />),
  '/': createRoute(<AppHomeRoute />),
  '/dashboard/echarts': createRoute(() => import('./dashboard/echarts/ECharts')),
  '/list/standard-table': createRoute(() => import('./list/standard-table/StandardTable')),
  '/list/standard-table/:id': createRoute(
    () => import('./list/standard-table/detail/Detail'),
    () => {
      return useParams()['id'];
    },
  ),
  '/test/acl': createRoute(() => import('./test/acl/ACL')),
  '/test/http': createRoute(() => import('./test/http/Http')),
  '/exception/:status': createRoute(<AppExceptionRoute />, () => {
    return useParams()['status'];
  }),
};

const AppRouter = memo(() => {
  const location = useLocation();
  const { t } = useTranslation();

  const ACLGuard = useACLGuard('/exception/403');

  const token = useToken();
  const tokenGuard = useTokenGuard(token ? token.expired : true, LOGIN_PATH, { [PREV_ROUTE_KEY]: location });

  return (
    <Router
      routes={[
        {
          path: LOGIN_PATH,
          element: ROUTES[LOGIN_PATH],
          data: {
            title: t('login', { ns: 'title' }),
          },
        },
        {
          path: '/',
          element: ROUTES['/'],
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
                  element: ROUTES['/dashboard/echarts'],
                  data: {
                    title: t('eCharts', { ns: 'title' }),
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
                  element: ROUTES['/list/standard-table'],
                  data: {
                    title: t('standardTable', { ns: 'title' }),
                    acl: ROUTES_ACL['/list/standard-table'],
                    canActivate: [ACLGuard],
                  },
                },
                {
                  path: 'standard-table/:id',
                  element: ROUTES['/list/standard-table/:id'],
                  data: {
                    title: t('deviceDetail', { ns: 'title' }),
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
                  element: ROUTES['/test/acl'],
                  data: {
                    title: t('acl', { ns: 'title' }),
                    acl: ROUTES_ACL['/test/acl'],
                    canActivate: [ACLGuard],
                  },
                },
                {
                  path: 'http',
                  element: ROUTES['/test/http'],
                  data: {
                    title: t('http', { ns: 'title' }),
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
          element: ROUTES['/exception/:status'],
          data: (params) => ({
            title: params.status,
          }),
        },
        {
          path: '*',
          element: <Navigate to="/exception/404" replace />,
        },
      ]}
      titleOptions={{
        default: t('app'),
        separator: ' - ',
        suffix: t('app'),
      }}
    />
  );
});

export default AppRouter;
