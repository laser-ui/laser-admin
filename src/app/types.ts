import type { MenuMode } from '@laser-ui/components/menu/types';

export {};

export type AppLang = 'en-US' | 'zh-CN';

export type AppTheme = 'light' | 'dark';

export interface AppLayout {
  menu: {
    mode: MenuMode;
  };
}

export interface AppUser {
  id: number;
  name: string;
  avatar?: { id: number; name: string; path: string } | null;
  permissions: (string | number)[];
}

export interface AppMenu {
  expands?: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  list: {
    message: string;
    read: boolean;
  }[];
}
