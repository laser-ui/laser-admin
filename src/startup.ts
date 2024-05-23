import { useHttp, useStorage } from '@laser-ui/admin';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { HTTP_CONFIGS } from './app/configs/http';
import { STORAGE } from './app/configs/storage';
import { rememberToken } from './app/core/token';
import resources from './resources.json';

export const startup = new Promise<void>((r) => {
  const defaultStorage: any = {};
  Object.values(STORAGE).forEach(([key, options]) => {
    defaultStorage[key] = options.defaultValue;
  });
  useStorage.config({ default: defaultStorage });
  r();
}).then(() => {
  rememberToken(useStorage.get(...STORAGE.remember) === '1');

  useHttp.config(HTTP_CONFIGS);

  return i18n.use(initReactI18next).init({
    resources,
    lng: useStorage.get(...STORAGE.language),
    interpolation: {
      escapeValue: false,
    },
  });
});
