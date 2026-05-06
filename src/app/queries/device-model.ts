import type { UseQueryOptions } from '@tanstack/react-query';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { createQueryKey, getParams } from './utils';
import { useHttp } from '../core';

export const DEVICE_MODELS_QUERY_KEYS = createQueryKey('device-models');

export interface DeviceModelQueryParams {
  page: number;
  pageSize: number;
}

export function useDeviceModelsQuery<T = AppStandardResponse.List<AppDocs.DeviceModel>>(
  _params: Partial<DeviceModelQueryParams> = {},
  extraParams?: any,
  options?: Partial<UseQueryOptions>,
) {
  const http = useHttp();

  const params = Object.assign(
    getParams(_params, {} as AppStandardRequest.Params, {
      page: (value, data) => {
        data.page = value;
      },
      pageSize: (value, data) => {
        data.page_size = value;
      },
    }),
    extraParams,
  );

  const deviceModelsQueryOptions = queryOptions<T>({
    queryKey: DEVICE_MODELS_QUERY_KEYS.list(params),
    queryFn: (context) => http({ url: '/device-models', method: 'get', params, signal: context.signal }),
    ...(options as any),
  });
  const deviceModelsQuery = useQuery<T>(deviceModelsQueryOptions);

  return { deviceModelsQuery, deviceModelsQueryOptions, params };
}
