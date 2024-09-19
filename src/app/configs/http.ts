import type { HttpConfigs } from '@laser-pro/http/configs';

import mock from '../mock';

export const HTTP_CONFIGS: HttpConfigs = import.meta.env.DEV
  ? {
      mock,
      baseURL: 'https://test.example.com',
      transformURL: (url: string) => {
        return '/api/v1' + url;
      },
    }
  : {
      mock,
      baseURL: 'https://test.example.com',
      transformURL: (url: string) => {
        return '/api/v1' + url;
      },
    };
