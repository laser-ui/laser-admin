import type { AppLang, AppLayout, AppTheme } from '../types';
import type { Options } from '@laser-ui/admin/packages/storage/useStorage';

type Value<T> = [string, Options<T>];
export const STORAGE = {
  language: ['language', { defaultValue: 'zh-CN' }] as Value<AppLang>,
  theme: ['theme', { defaultValue: 'light' }] as Value<AppTheme>,
  layout: ['layout', { defaultValue: { menu: { mode: 'vertical' } }, parser: 'json' }] as Value<AppLayout>,
  remember: ['remember', { defaultValue: '1' }] as Value<'1' | '0'>,
};
