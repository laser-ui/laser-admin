import type { AppUser } from '../types';

import { useACL } from '@laser-pro/acl';
import { axios } from '@laser-pro/http';

import { GlobalStore } from './store';
import { ROLE_ACL } from '../configs/acl';

export function initUser(user: AppUser) {
  useACL.acl.set([]);
  const superAdmin = user.permissions.includes(ROLE_ACL.super_admin);
  useACL.acl.setFull(superAdmin);
  if (superAdmin) {
    useACL.acl.add(ROLE_ACL.super_admin);
  }
  useACL.acl.add(user.permissions);

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
}
