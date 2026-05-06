import type { Token } from '@laser-pro/auth';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { DialogService, Toast } from '@laser-ui/components';
import { useUnmount } from '@laser-ui/hooks';
import axios from 'axios';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { LOGIN_PATH, PREV_ROUTE_KEY } from '../../configs/router';

export interface HttpConfigs {
  mock?: (config: AxiosRequestConfig) => Promise<AxiosResponse>;
  baseURL?: string;
  transformURL: (url: string) => string;
  token?: Token;
}

export interface HttpRequestConfigOverrides {
  baseURL?: boolean;
  url?: boolean;
  authorization?: boolean;
}

export interface HttpInstance {
  <T = any, D = any>(config: AxiosRequestConfig, overrides?: true | HttpRequestConfigOverrides): Promise<AxiosResponse<T, D>>;
  config: (configs: Partial<HttpConfigs>) => void;
  configs: HttpConfigs;
}

export type UseHttpInstance = <T = any>(config: AxiosRequestConfig, overrides?: true | HttpRequestConfigOverrides) => Promise<T>;

export class HttpScope {
  private _configs: HttpConfigs = {
    transformURL: (url: string) => url,
  };

  get configs(): HttpConfigs {
    return this._configs;
  }

  config(configs: Partial<HttpConfigs>): void {
    Object.assign(this._configs, configs);
  }

  request<T = any, D = any>(config: AxiosRequestConfig, overrides?: true | HttpRequestConfigOverrides): Promise<AxiosResponse<T, D>> {
    const httpInstance = this._configs.mock ? this._configs.mock : axios;

    if (overrides === true) {
      return httpInstance(config);
    }

    const token = this._configs.token;

    let headers = config.headers;
    if (!overrides?.authorization) {
      if (token) {
        headers = Object.assign({}, config.headers);
        headers.Authorization = `Bearer ${token.value}`;
      }
    }

    return httpInstance({
      ...config,
      baseURL: overrides?.baseURL ? config.baseURL : this._configs.baseURL,
      url: overrides?.url ? config.url : config.url ? this._configs.transformURL(config.url) : undefined,
      headers,
    });
  }

  createHttp(): HttpInstance {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const http = <T = any, D = any>(config: AxiosRequestConfig, overrides?: true | HttpRequestConfigOverrides) =>
      that.request<T, D>(config, overrides);
    http.config = (configs: Partial<HttpConfigs>) => that.config(configs);
    http.configs = that.configs;
    return http;
  }

  createHttpHook(): () => UseHttpInstance {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return function useHttp() {
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
        return that
          .request({ signal: controller.signal, ...config }, overrides)
          .then((res) => res.data as T)
          .catch((error) => {
            if (error.response) {
              switch (error.response.status) {
                case 401:
                  DialogService.open(Toast, {
                    children: t('unauthorized'),
                    type: 'error',
                  });
                  navigate(LOGIN_PATH, { state: { [PREV_ROUTE_KEY]: location.pathname } });
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
            return Promise.reject(error);
          })
          .finally(() => {
            controllers.current.delete(controller);
          });
      };
    };
  }
}

export const httpScope = new HttpScope();
export const http = httpScope.createHttp();
export const useHttp = httpScope.createHttpHook();
