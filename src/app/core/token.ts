import type { JWTTokenPayload } from '@laser-pro/auth/jwt-token';

import { JWTToken } from '@laser-pro/auth';
import { useStorage } from '@laser-pro/storage';

import { axios } from './axios';
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
    axios.config({ token: TOKEN.value });
  },
  remember: false,
  remove: () => {
    if (TOKEN.value) {
      TOKEN.value.destroy();
      TOKEN.value = undefined;
    }
    useStorage.remove(STORAGE.token[0]);
    axios.config({ token: TOKEN.value });
  },
};
