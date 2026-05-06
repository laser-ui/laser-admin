import { storageScope } from '@laser-pro/storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { HTTP_CONFIGS } from './app/configs/http';
import { LOGIN_PATH } from './app/configs/router';
import { STORAGE } from './app/configs/storage';
import { TOKEN, TOKEN_STORAGE, http, initUser } from './app/core';
import resources from './resources';

const configStorage = async () => {
  const defaultStorage: any = {};
  Object.values(STORAGE).forEach(([key, options]) => {
    if ('defaultValue' in options) {
      defaultStorage[key] = options.defaultValue;
    }
  });
  storageScope.config({ default: defaultStorage });
};

const configToken = async () => {
  if (storageScope.get(...STORAGE.remember) === '1') {
    const token = storageScope.get<string | null>(TOKEN_STORAGE.key);
    if (token) {
      TOKEN.setValue(token);
    }
  }
};

const configHttp = async () => {
  http.config(HTTP_CONFIGS);
};

const initI18n = async () => {
  await i18n.use(initReactI18next).init({
    resources,
    lng: storageScope.get(...STORAGE.language),
    interpolation: {
      escapeValue: false,
    },
  });
};

const initData = async (): Promise<string | undefined> => {
  if (!TOKEN.value || TOKEN.value.expired) {
    return LOGIN_PATH;
  }
  try {
    const res = await http({
      url: '/auth/me',
      method: 'get',
    });
    initUser(res.data);
    return undefined;
  } catch {
    return LOGIN_PATH;
  }
};

export const startup = async () => {
  await configStorage();
  await configToken();
  await configHttp();
  const [authPath] = await Promise.all([initData()]);
  await initI18n();
  return authPath;
};
