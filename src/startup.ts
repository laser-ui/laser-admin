import { axios, useHttp } from '@laser-pro/http';
import { useStorage } from '@laser-pro/storage';
import i18n from 'i18next';
import { isNull } from 'lodash';
import { initReactI18next } from 'react-i18next';

import { HTTP_CONFIGS } from './app/configs/http';
import { HASH, LOGIN_PATH } from './app/configs/router';
import { STORAGE } from './app/configs/storage';
import { initUser } from './app/core';
import { TOKEN, rememberToken } from './app/core/token';
import resources from './resources.json';

function redirect(path: string) {
  window.history.replaceState(null, '', (HASH ? '#' : '') + path);
}

const configStorage = () =>
  new Promise<void>((r) => {
    const defaultStorage: any = {};
    Object.values(STORAGE).forEach(([key, options]) => {
      defaultStorage[key] = options.defaultValue;
    });
    useStorage.config({ default: defaultStorage });
    r();
  });

const configToken = () =>
  new Promise<void>((r) => {
    rememberToken(useStorage.get(...STORAGE.remember) === '1');
    r();
  });

const configHttp = () =>
  new Promise<void>((r) => {
    useHttp.config(HTTP_CONFIGS);
    r();
  });

const initI18n = () =>
  i18n.use(initReactI18next).init({
    resources,
    lng: useStorage.get(...STORAGE.language),
    interpolation: {
      escapeValue: false,
    },
  });

const initData = () =>
  new Promise<void>((r) => {
    if (!isNull(TOKEN.value) && !TOKEN.expired) {
      axios({
        url: '/auth/me',
        method: 'get',
      })
        .then((res) => {
          initUser(res.data);
        })
        .catch(() => {
          redirect(LOGIN_PATH);
        })
        .finally(r);
    } else {
      redirect(LOGIN_PATH);
      r();
    }
  });

export const startup = configStorage()
  .then(() => Promise.all([configToken(), configHttp()]))
  .then(() => Promise.all([initI18n(), initData()]));
