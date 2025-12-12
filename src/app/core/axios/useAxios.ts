import type { HttpRequestConfigOverrides } from './types';
import type { AxiosRequestConfig } from 'axios';

import { DialogService, Toast } from '@laser-ui/components';
import { useUnmount } from '@laser-ui/hooks';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { axios } from './axios';
import { LOGIN_PATH, PREV_ROUTE_KEY } from '../../configs/router';

export function useAxios() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const controllers = useRef<Set<AbortController>>(new Set());

  useUnmount(() => {
    for (const controller of controllers.current) {
      controller.abort();
    }
    controllers.current.clear();
  });

  return <T = any>(config: AxiosRequestConfig, overrides?: true | HttpRequestConfigOverrides): Promise<T> => {
    const controller = new AbortController();
    controllers.current.add(controller);
    return axios({ signal: controller.signal, ...config }, overrides)
      .then((res) => res.data)
      .catch((error) => {
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
              if (location.pathname !== LOGIN_PATH) {
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
      })
      .finally(() => {
        controllers.current.delete(controller);
      });
  };
}
