import { useStorage } from '@laser-pro/storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { HTTP_CONFIGS } from './app/configs/http';
import { LOGIN_PATH } from './app/configs/router';
import { STORAGE } from './app/configs/storage';
import { TOKEN, axios, initUser } from './app/core';
import resources from './resources.json';

const configStorage = () =>
  new Promise<void>((r) => {
    const defaultStorage: any = {};
    Object.values(STORAGE).forEach(([key, options]) => {
      if ('defaultValue' in options) {
        defaultStorage[key] = options.defaultValue;
      }
    });
    useStorage.config({ default: defaultStorage });
    r();
  });

const configToken = () =>
  new Promise<void>((r) => {
    const token = useStorage.get(...STORAGE.token);
    if (token) {
      TOKEN.setValue(token);
    }
    TOKEN.remember = useStorage.get(...STORAGE.remember) === '1';
    r();
  });

const configHttp = () =>
  new Promise<void>((r) => {
    axios.config(HTTP_CONFIGS);
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
  new Promise<string | undefined>((r) => {
    if (TOKEN.value && !TOKEN.value.expired) {
      axios({
        url: '/auth/me',
        method: 'get',
      })
        .then((res) => {
          initUser(res.data);
        })
        .catch(() => {
          r(LOGIN_PATH);
        })
        .finally(() => {
          r(undefined);
        });
    } else {
      r(LOGIN_PATH);
    }
  });

export const startup = configStorage()
  .then(() => configToken())
  .then(() => configHttp())
  .then(() => Promise.all([initData(), initI18n()]))
  .then((res) => res[0]);
