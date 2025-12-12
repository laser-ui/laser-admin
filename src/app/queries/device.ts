import type { UseQueryOptions } from '@tanstack/react-query';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { createQueryKey, getParams } from './utils';
import { useAxios } from '../core';

export const DEVICES_QUERY_KEYS = createQueryKey('devices');

export interface DeviceQueryParams {
  keyword: string;
  model: string[];
  status: number[];
  page: number;
  pageSize: number;
}

export function useDevicesQuery<T = AppStandardResponse.List<AppDocs.Device>>(
  _params: Partial<DeviceQueryParams> = {},
  extraParams?: any,
  options?: Partial<UseQueryOptions>,
) {
  const axios = useAxios();

  const params = Object.assign(
    getParams(_params, {} as AppStandardRequest.Params, {
      keyword: (value, data) => {
        data['keyword'] = value;
      },
      model: (value, data) => {
        data['filter[model:in]'] = value.join();
      },
      status: (value, data) => {
        data['filter[status:in]'] = value.join();
      },
      page: (value, data) => {
        data.page = value;
      },
      pageSize: (value, data) => {
        data.page_size = value;
      },
    }),
    extraParams,
  );

  const devicesQueryOptions = queryOptions<T>({
    queryKey: DEVICES_QUERY_KEYS.list(params),
    queryFn: (context) => axios({ url: '/devices', method: 'get', params, signal: context.signal }),
    ...(options as any),
  });
  const devicesQuery = useQuery<T>(devicesQueryOptions);

  return { devicesQuery, devicesQueryOptions, params };
}

export function useDeviceQuery<T = AppDocs.Device>(id: number, extraParams?: any, options?: Partial<UseQueryOptions>) {
  const axios = useAxios();

  const deviceQueryOptions = queryOptions<T>({
    queryKey: DEVICES_QUERY_KEYS.detail(id),
    queryFn: (context) => axios({ url: `/devices/${id}`, method: 'get', params: extraParams, signal: context.signal }),
    ...(options as any),
  });
  const deviceQuery = useQuery<T>(deviceQueryOptions);

  return { deviceQuery, deviceQueryOptions };
}
