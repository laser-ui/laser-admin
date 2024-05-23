import { JWTToken, axios } from '@laser-ui/admin';

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
