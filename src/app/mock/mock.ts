import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { base64url } from '@laser-pro/auth/base64url';
import { isString, nth } from 'lodash';

import { DATA } from './data';
import { TOKEN } from '../core';

export function mock(config: AxiosRequestConfig) {
  return new Promise<AxiosResponse>((resolve, reject) => {
    const response = (data: any, delay: number) => {
      setTimeout(() => {
        resolve({ data } as any);
      }, delay);
    };
    const match = (url: string | RegExp) => {
      if (isString(url)) {
        return url === config.url;
      } else {
        return url.test(config.url!);
      }
    };

    switch (true) {
      case match('/api/v1/auth/login'): {
        response(
          {
            user: config.data.username === 'admin' ? DATA.admin : DATA.user,
            token: `${base64url.encode(JSON.stringify({}))}.${base64url.encode(
              JSON.stringify({
                exp: ~~((Date.now() + 2 * 60 * 60 * 1000) / 1000),
                admin: config.data.username === 'admin',
              }),
            )}.signature`,
          },
          500,
        );
        break;
      }

      case match('/api/v1/auth/me'): {
        response((TOKEN.value!.payload as any).admin ? DATA.admin : DATA.user, 500);
        break;
      }

      case match('/api/v1/auth/refresh'): {
        response(
          `${base64url.encode(JSON.stringify({}))}.${base64url.encode(
            JSON.stringify({
              exp: ~~((Date.now() + 2 * 60 * 60 * 1000) / 1000),
              admin: (TOKEN.value!.payload as any)?.admin,
            }),
          )}.signature`,
          500,
        );
        break;
      }

      case match('/api/v1/notifications'): {
        response(DATA.notifications, 500);
        break;
      }

      case match(/\/api\/v1\/user\/[0-9]+/): {
        response({ success: true }, 500);
        break;
      }

      case match('/api/v1/device-models'): {
        response({ resources: [...DATA.deviceModels].sort(() => -1) }, 500);
        break;
      }

      case match('/api/v1/devices'): {
        if (config.method === 'get') {
          const page = Math.min(Math.max(1, Math.ceil(DATA.devices.length / config.params.page_size)), config.params.page);
          response(
            {
              resources: [...DATA.devices].sort(() => -1).slice((page - 1) * config.params.page_size, page * config.params.page_size),
              metadata: {
                page,
                page_size: config.params.page_size,
                total_size: DATA.devices.length,
              },
            },
            500,
          );
        } else {
          const device = {
            id: (nth(DATA.devices, -1)?.id ?? 0) + 1,
            create_time: Date.now() + 60 * 60 * 1000,
            update_time: Date.now() + 60 * 60 * 1000,
            price: ~~(Math.random() * 1000),
            status: ~~(Math.random() * 9) % 3,
            ...config.data,
          };
          DATA.devices.push(device);
          response({ success: true, data: device }, 500);
        }
        break;
      }

      case match(/\/api\/v1\/devices\/[0-9]+/): {
        const index = DATA.devices.findIndex((device) => device.id === Number(config.url!.match(/[0-9]+$/)![0]));
        if (config.method === 'get') {
          response(DATA.devices[index], 500);
        } else if (config.method === 'patch') {
          DATA.devices[index] = { ...DATA.devices[index], ...config.data };
          response({ success: true, data: DATA.devices[index] }, 500);
        } else {
          response({ success: true, data: DATA.devices.splice(index, 1)[0] }, 500);
        }
        break;
      }

      case match('/api/v1/test/http'): {
        setTimeout(() => {
          reject({ response: { status: config.data.status } } as AxiosError);
        }, 500);
        break;
      }

      default:
        break;
    }
  });
}
