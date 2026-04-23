import type { JWTTokenPayload } from '@laser-pro/auth/jwt-token';
import type { AbstractStorage } from '@laser-pro/storage';

import { JWTToken } from '@laser-pro/auth';
import { LocalStorageService, storageScope } from '@laser-pro/storage';
import { useSyncExternalStore } from 'react';

import { axios } from './axios';
import { STORAGE } from '../configs/storage';

const configs = {
  refresh: () => {
    if (storageScope.get(...STORAGE.remember) === '1') {
      axios({
        url: '/auth/refresh',
        method: 'post',
      }).then((res) => {
        TOKEN.setValue(res.data);
      });
    }
  },
};

let listeners: (() => void)[] = [];
const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};
const subscribe = (onChange: () => void) => {
  listeners = listeners.concat([onChange]);
  return () => {
    listeners = listeners.filter((f) => f !== onChange);
  };
};
const getSnapshot = () => {
  return TOKEN.value;
};
export function useToken() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const TOKEN_STORAGE = {
  key: 'token',
  service: new LocalStorageService() as AbstractStorage<string, string>,
};
export const TOKEN = {
  value: undefined as JWTToken<JWTTokenPayload> | undefined,
  setValue: (val: string) => {
    if (TOKEN.value) {
      TOKEN.value.destroy();
    }

    TOKEN_STORAGE.service.setItem(TOKEN_STORAGE.key, val);
    TOKEN.value = new JWTToken(val, configs);
    axios.config({ token: TOKEN.value });

    emitChange();
  },
  remove: () => {
    TOKEN_STORAGE.service.removeItem(TOKEN_STORAGE.key);
    if (TOKEN.value) {
      TOKEN.value.destroy();
      TOKEN.value = undefined;
    }
    axios.config({ token: TOKEN.value });

    emitChange();
  },
};
