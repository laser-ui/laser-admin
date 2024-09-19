import type { JWTTokenPayload } from '@laser-pro/auth/jwt-token';

import { JWTToken } from '@laser-pro/auth';
import { axios, useHttp } from '@laser-pro/http';
import { useStorage } from '@laser-pro/storage';

import { STORAGE } from '../configs/storage';

const configs = {
  refresh: () => {
    if (TOKEN.remember) {
      axios({
        url: '/auth/refresh',
        method: 'post',
      }).then((res) => {
        TOKEN.setValue(res.data);
      });
    }
  },
};
export const TOKEN = {
  value: undefined as JWTToken<JWTTokenPayload> | undefined,
  setValue: (val: string) => {
    TOKEN.value = new JWTToken(val, configs);
    useStorage.set(STORAGE.token[0], val);
    useHttp.config({ token: TOKEN.value });
  },
  remember: false,
  remove: () => {
    if (TOKEN.value) {
      TOKEN.value.destroy();
      TOKEN.value = undefined;
    }
    useStorage.remove(STORAGE.token[0]);
    useHttp.config({ token: TOKEN.value });
  },
};
