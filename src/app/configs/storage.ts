import type { Options } from '@laser-ui/admin/packages/storage/useStorage';

type Key = 'language' | 'theme' | 'layout';
export const STORAGE: { [K in Key]: [K, Options<any>] } = {
  language: ['language', { defaultValue: 'zh-CN' }],
  theme: ['theme', { defaultValue: 'light' }],
  layout: ['layout', { defaultValue: { menu: { mode: 'vertical' } }, parser: 'json' }],
};
