import type { NavigateOptions } from 'react-router-dom';

import * as JSURL from 'jsurl';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const KEY = 'q';

export function useSaveQuery<T>(): [T | undefined, (newQuery: T, options?: NavigateOptions) => void] {
  const navigate = useNavigate();

  const initialQuery = useMemo(() => {
    const paramValue = new URLSearchParams(window.location.search).get(KEY);
    return paramValue ? JSURL.parse(paramValue) : undefined;
  }, []);

  return [
    initialQuery,
    (newValue: T, options?: NavigateOptions) => {
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set(KEY, JSURL.stringify(newValue));
      navigate('?' + newSearchParams, { replace: true, ...options });
    },
  ];
}
