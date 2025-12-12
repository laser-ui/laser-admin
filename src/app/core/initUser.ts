import { acl } from '@laser-pro/acl';

import { axios } from './axios';
import { GlobalStore } from './store';
import { ROLE_ACL } from '../configs/acl';

export function initUser(user: AppDocs.User) {
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
    url: '/notifications',
    method: 'get',
  }).then((res) => {
    GlobalStore.set('appNotifications', res.data);
  });
}
