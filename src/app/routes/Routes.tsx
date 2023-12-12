import type { AppRouteProps, CanActivateFn, RouteItem, RouteItemInput } from './types';
import type { RouteMatch } from 'react-router-dom';

import { isFunction, isUndefined, nth } from 'lodash';
import { Suspense, createElement, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { matchRoutes, Navigate, renderMatches, useLocation } from 'react-router-dom';

import { useACLGuard, useTokenGuard } from './Routes.guard';
import AppExceptionRoute from './exception/Exception';
import AppHomeRoute from './home/Home';
import AppLayout from './layout/Layout';
import AppLoginRoute from './login/Login';
import { ROUTES, RouteStateContext } from './vars';
import { AppFCPLoader } from '../components';
import { ROUTES_ACL } from '../configs/acl';
import { LOGIN_PATH, TITLE_CONFIG } from '../configs/app';

function AppRoute(props: AppRouteProps) {
  const { path, element } = props;

  const location = useLocation();

  return element ? (
    createElement(element, { key: location.pathname })
  ) : (
    <Suspense key={location.pathname} fallback={<AppFCPLoader />}>
      {createElement(ROUTES[path!])}
    </Suspense>
  );
}

const AppRoutes = memo(() => {
  const ACLGuard = useACLGuard();
  const tokenGuard = useTokenGuard();
  const location = useLocation();
  const { t } = useTranslation();

  const matches = matchRoutes(
    [
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
                  title: t('Standard Table', { ns: 'title' }),
                  acl: ROUTES_ACL['/list/standard-table'],
                  canActivate: [ACLGuard],
                },
              },
              {
                path: 'standard-table/:id',
                element: <AppRoute path="/list/standard-table/:id" />,
                data: {
                  title: t('Device Detail', { ns: 'title' }),
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
    ] as RouteItemInput[],
    location,
  ) as any as RouteMatch<string, RouteItem>[] | null;
  if (matches) {
    matches.forEach((matche) => {
      if (isFunction(matche.route.data)) {
        matche.route.data = matche.route.data(matche.params);
      }
    });
  }

  const element: React.ReactNode = (() => {
    if (!matches) {
      return null;
    }

    let canActivateChild: CanActivateFn[] = [];
    for (const match of matches) {
      const routeData = (match.route as RouteItem).data;
      if (routeData && routeData.canActivate) {
        for (const canActivate of routeData.canActivate.concat(canActivateChild)) {
          const can = canActivate(match.route);
          if (can !== true) {
            return can;
          }
        }
      }
      if (routeData && routeData.canActivateChild) {
        canActivateChild = canActivateChild.concat(routeData.canActivateChild);
      }
    }

    return renderMatches(matches);
  })();

  const title = (() => {
    if (matches) {
      const match = nth(matches, -1);
      if (match) {
        const { title } = match.route.data ?? {};
        return isFunction(title) ? title(match.params) : title;
      }
    }
  })();
  useEffect(() => {
    if (isUndefined(title)) {
      document.title = TITLE_CONFIG.default;
    } else {
      const arr = [title];
      if (TITLE_CONFIG.prefix) {
        arr.unshift(TITLE_CONFIG.prefix);
      }
      if (TITLE_CONFIG.suffix) {
        arr.push(TITLE_CONFIG.suffix);
      }
      document.title = arr.join(TITLE_CONFIG.separator ?? ' - ');
    }
    return () => {
      document.title = TITLE_CONFIG.default;
    };
  });

  return (
    <RouteStateContext.Provider
      value={{
        matchRoutes: matches,
        title,
      }}
    >
      {element}
    </RouteStateContext.Provider>
  );
});

export default AppRoutes;
