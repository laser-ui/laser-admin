import type { JWTToken, JWTTokenPayload } from '../token';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { isString, nth } from 'lodash';

import { DATA } from './data';
import { base64url } from '../../utils';
import { TOKEN } from '../token';

export default function mock(config: AxiosRequestConfig) {
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
        response((TOKEN as JWTToken<JWTTokenPayload & { admin: boolean }>).payload?.admin ? DATA.admin : DATA.user, 500);
        break;
      }

      case match('/api/v1/auth/refresh'): {
        response(
          `${base64url.encode(JSON.stringify({}))}.${base64url.encode(
            JSON.stringify({
              exp: ~~((Date.now() + 2 * 60 * 60 * 1000) / 1000),
              admin: (TOKEN as JWTToken<JWTTokenPayload & { admin: boolean }>).payload?.admin,
            }),
          )}.signature`,
          500,
        );
        break;
      }

      case match('/api/v1/notification'): {
        response(DATA.notification, 500);
        break;
      }

      case match(/\/api\/v1\/user\/[0-9]+/): {
        response({ success: true }, 500);
        break;
      }

      case match('/api/v1/device/model'): {
        response({ resources: [...DATA.deviceModelList].sort(() => -1) }, 500);
        break;
      }

      case match('/api/v1/device'): {
        if (config.method === 'get') {
          const page = Math.min(Math.max(1, Math.ceil(DATA.deviceList.length / config.params.page_size)), config.params.page);
          response(
            {
              resources: [...DATA.deviceList].sort(() => -1).slice((page - 1) * config.params.page_size, page * config.params.page_size),
              metadata: {
                page,
                page_size: config.params.page_size,
                total_size: DATA.deviceList.length,
              },
            },
            500,
          );
        } else {
          DATA.deviceList.push({
            id: (nth(DATA.deviceList, -1)?.id ?? 0) + 1,
            create_time: Date.now() + 60 * 60 * 1000,
            update_time: Date.now() + 60 * 60 * 1000,
            price: ~~(Math.random() * 1000),
            status: ~~(Math.random() * 9) % 3,
            ...config.data,
          });
          response({ success: true }, 500);
        }
        break;
      }

      case match(/\/api\/v1\/device\/[0-9]+/): {
        const index = DATA.deviceList.findIndex((device) => device.id === Number(config.url!.match(/[0-9]+$/)![0]));
        if (config.method === 'get') {
          response(DATA.deviceList[index], 500);
        } else if (config.method === 'patch') {
          DATA.deviceList[index] = { ...DATA.deviceList[index], ...config.data };
          response({ success: true }, 500);
        } else {
          DATA.deviceList.splice(index, 1);
          response({ success: true }, 500);
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
