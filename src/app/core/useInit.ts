import type { AppNotification, AppUser } from '../types';

import { useACL } from '@laser-ui/hooks';
import { isNull } from 'lodash';

import { useHttp } from './http';
import { GlobalStore } from './store';
import { TOKEN } from './token';
import { ROLE_ACL } from '../configs/acl';
import { TOKEN_ENABLE, TOKEN_REFRESH, TOKEN_REFRESH_OFFSET } from '../configs/token';

let CLEAR_TOKEN_REFRESH: (() => void) | undefined;

export function useInit() {
  const acl = useACL();
  const http = useHttp();

  return (user: AppUser) => {
    acl.set([]);
    const superAdmin = user.permissions.includes(ROLE_ACL.super_admin);
    acl.setFull(superAdmin);
    if (superAdmin) {
      acl.add(ROLE_ACL.super_admin);
    }
    acl.add(user.permissions);

    GlobalStore.set('appUser', user);
    GlobalStore.set('appMenu', (draft) => {
      draft.expands = undefined;
    });
    GlobalStore.set('appNotifications', undefined);
    http<AppNotification[]>(
      {
        url: '/notification',
        method: 'get',
      },
      { unmount: false },
    )[0].then((res) => {
      GlobalStore.set('appNotifications', res);
    });

    if (TOKEN_ENABLE) {
      CLEAR_TOKEN_REFRESH?.();
      if (TOKEN_REFRESH) {
        const refresh = () => {
          const expiration = TOKEN.expiration;
          if (!isNull(expiration) && !TOKEN.expired) {
            const tid = window.setTimeout(
              () => {
                const [req, abort] = http<string>(
                  {
                    url: '/auth/refresh',
                    method: 'post',
                  },
                  { unmount: false },
                );
                req.then((res) => {
                  TOKEN.set(res);

                  refresh();
                });
                CLEAR_TOKEN_REFRESH = () => {
                  abort();
                };
              },
              expiration - Date.now() - TOKEN_REFRESH_OFFSET,
            );
            CLEAR_TOKEN_REFRESH = () => {
              clearTimeout(tid);
            };
          }
        };
        refresh();
      }
    }
  };
}
