import type { AppTableColumn } from './types';

import { get, isNumber, isString } from 'lodash';
import { createElement } from 'react';

import { AppCopy } from '../copy';

export function toCssUnit(val: string | number) {
  return isNumber(val) ? val + 'px' : val;
}

export function getKey(data: any) {
  if ('id' in data) {
    return data.id;
  }
  throw new Error('Please provide `itemKey`');
}

export function getContent(column: AppTableColumn<any>, data: any, index: number) {
  const content = isString(column.td) ? get(data, column.td) : column.td(data, index);
  return column.copyable ? createElement(AppCopy, { children: content }) : content;
}
