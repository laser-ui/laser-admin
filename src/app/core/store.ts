import type { AppMenu, AppUser } from '../types';

import { createStore } from 'rcl-store';

export const GlobalStore = createStore<{
  appUser: AppUser;
  appMenu: AppMenu;
  appNotifications: any[][] | undefined;
}>({
  appUser: {} as any,
  appMenu: {},
  appNotifications: undefined,
});
