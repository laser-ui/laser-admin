import type { TitleOptions } from '@laser-ui/admin/packages/router/types';

export const APP_NAME = 'Laser Admin';

export const TITLE_OPTIONS: TitleOptions = {
  default: APP_NAME,
  separator: ' - ',
  suffix: APP_NAME,
};

export const LOGIN_PATH = '/login';

export const PREV_ROUTE_KEY = 'from';
