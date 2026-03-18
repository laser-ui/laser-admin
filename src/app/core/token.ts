import type { JWTTokenPayload } from '@laser-pro/auth/jwt-token';

import { JWTToken } from '@laser-pro/auth';
import { useStorage } from '@laser-pro/storage';
import { useSyncExternalStore } from 'react';

import { axios } from './axios';
import { STORAGE } from '../configs/storage';

const configs = {
  refresh: () => {
    if (useStorage.get(...STORAGE.remember) === '1') {
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

export const TOKEN = {
  value: undefined as JWTToken<JWTTokenPayload> | undefined,
  setValue: (val: string) => {
    if (TOKEN.value) {
      TOKEN.value.destroy();
    }

    TOKEN.value = new JWTToken(val, configs);
    useStorage.set(STORAGE.token[0], val);
    axios.config({ token: TOKEN.value });

    emitChange();
  },
  remove: () => {
    if (TOKEN.value) {
      TOKEN.value.destroy();
      TOKEN.value = undefined;
    }
    useStorage.remove(STORAGE.token[0]);
    axios.config({ token: TOKEN.value });

    emitChange();
  },
};
