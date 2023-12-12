import type { CanActivateFn } from './types';

import { useACL } from '@laser-ui/hooks';
import { isNull, isObject } from 'lodash';
import { Navigate, useLocation } from 'react-router-dom';

import { LOGIN_PATH, PREV_ROUTE_KEY } from '../configs/app';
import { TOKEN_ENABLE } from '../configs/token';
import { TOKEN } from '../core';

export function useACLGuard(): CanActivateFn {
  const acl = useACL();
  return (route) => {
    if (route.data && route.data.acl) {
      const params =
        isObject(route.data.acl) && 'control' in route.data.acl
          ? route.data.acl
          : {
              control: route.data.acl,
            };
      if (!acl.can(params.control, params.mode)) {
        return <Navigate to="/exception/403" replace />;
      }
    }

    return true;
  };
}

export function useTokenGuard(): CanActivateFn {
  if (!TOKEN_ENABLE) {
    return () => true;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const location = useLocation();

  return () => {
    const token = TOKEN.value;
    if (isNull(token)) {
      return <Navigate to={LOGIN_PATH} state={{ [PREV_ROUTE_KEY]: location }} replace />;
    }

    if (TOKEN.expired) {
      return <Navigate to={LOGIN_PATH} state={{ [PREV_ROUTE_KEY]: location }} replace />;
    }

    return true;
  };
}
