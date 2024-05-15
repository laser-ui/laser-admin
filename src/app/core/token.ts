import { JWTToken, axios } from '@laser-ui/admin';

export const TOKEN = new JWTToken({
  refresh: () =>
    axios({
      url: '/auth/refresh',
      method: 'post',
    }).then((res) => res.data),
});
