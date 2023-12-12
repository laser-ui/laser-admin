import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { DialogService, Toast } from '@laser-ui/components';
import { useEventCallback, useUnmount } from '@laser-ui/hooks';
import _axios from 'axios';
import { isNull } from 'lodash';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import mock from './mock';
import { LOGIN_PATH, PREV_ROUTE_KEY } from '../../configs/app';
import { HTTP_CONFIGS } from '../../configs/http';
import { TOKEN } from '../token';

const axios = HTTP_CONFIGS.mock ? mock : _axios;

export function useHttp() {
  const dataRef = useRef<{
    abortFns: Set<() => void>;
  }>({
    abortFns: new Set(),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const http = useEventCallback(
    <T = any, D = any>(
      config: AxiosRequestConfig<D>,
      options?: { unmount?: boolean; authorization?: boolean },
    ): [Promise<T>, () => void] => {
      const { unmount = true, authorization = true } = options ?? {};

      const isLogin = location.pathname === LOGIN_PATH;
      const controller = new AbortController();
      const abort = () => {
        controller.abort();
      };
      if (unmount) {
        dataRef.current.abortFns.add(abort);
      }

      const headers: any = { ...config.headers };
      if (authorization && !isNull(TOKEN.value)) {
        headers.Authorization = `Bearer ${TOKEN.value}`;
      }

      return [
        new Promise<T>((resolve) => {
          axios({
            ...config,
            baseURL: HTTP_CONFIGS.baseURL,
            url: HTTP_CONFIGS.transformURL(config.url!),
            headers,
            signal: controller.signal,
          })
            .then((res: AxiosResponse<T, D>) => {
              resolve(res.data);
            })
            .catch((error: AxiosError<T, D>) => {
              if (error.response) {
                switch (error.response.status) {
                  case 401:
                    DialogService.open(Toast, {
                      children: t('User not authorized'),
                      type: 'error',
                    });
                    navigate(LOGIN_PATH, { state: { [PREV_ROUTE_KEY]: location } });
                    break;

                  case 403:
                  case 404:
                  case 500:
                    if (!isLogin) {
                      navigate(`/exception/${error.response.status}`);
                    }
                    break;

                  default:
                    break;
                }
              } else if (error.request) {
                // The request was made but no response was received.
              } else {
                // Something happened in setting up the request that triggered an Error.
              }
            });
        }),
        abort,
      ];
    },
  );

  (http as any).abort = () => {
    for (const abort of dataRef.current.abortFns) {
      abort();
    }
    dataRef.current.abortFns = new Set();
  };

  useUnmount(() => {
    (http as any).abort();
  });

  return http as typeof http & { abort: () => void };
}
