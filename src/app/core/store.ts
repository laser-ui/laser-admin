import type { AppMenu, AppNotification, AppUser } from '../types';

import { createStore } from 'rcl-store';

export const GlobalStore = createStore<{
  appUser: AppUser;
  appMenu: AppMenu;
  appNotifications: AppNotification[] | undefined;
}>({
  appUser: {} as any,
  appMenu: {},
  appNotifications: undefined,
});
