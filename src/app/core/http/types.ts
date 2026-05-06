import type { Token } from '@laser-pro/auth';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export {};

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
