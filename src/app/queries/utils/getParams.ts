import { cloneDeep, isUndefined } from 'lodash';

import { checkEmpty } from '../../utils';

export function getParams<T extends object, R extends { [index: string]: any }>(
  params: T,
  reqParams: R = {} as any,
  mapping: { [K in keyof T]: (value: NonNullable<T[K]>, data: R) => void },
) {
  const data: any = cloneDeep(reqParams);
  Object.entries(params).forEach(([key, value]) => {
    if (!isUndefined(value) && !checkEmpty(value) && mapping[key as keyof T]) {
      mapping[key as keyof T](value, data);
    }
  });
  return data;
}
