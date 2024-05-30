import { JWTToken } from '@laser-pro/auth';
import { axios } from '@laser-pro/http';

export const TOKEN = new JWTToken({});
export const rememberToken = (remember: boolean) => {
  TOKEN.refresh = remember
    ? () =>
        axios({
          url: '/auth/refresh',
          method: 'post',
        }).then((res) => res.data)
    : false;
};
