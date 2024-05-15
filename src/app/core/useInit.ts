import type { AppUser } from '../types';

import { axios, useACL } from '@laser-ui/admin';

import { GlobalStore } from './store';
import { ROLE_ACL } from '../configs/acl';

export function useInit() {
  const acl = useACL();

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

    axios({
      url: '/notification',
      method: 'get',
    }).then((res) => {
      GlobalStore.set('appNotifications', res.data);
    });
  };
}
