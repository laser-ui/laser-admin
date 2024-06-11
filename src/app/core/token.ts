import { JWTToken } from '@laser-pro/auth';
import { axios } from '@laser-pro/http';

let remember = false;
export const TOKEN = new JWTToken({
  refresh: () =>
    new Promise((r) => {
      if (remember) {
        axios({
          url: '/auth/refresh',
          method: 'post',
        }).then((res) => {
          r(res.data);
        });
      } else {
        r(null);
      }
    }),
});

export const rememberToken = (val: boolean) => {
  remember = val;
};
