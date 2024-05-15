import type { AppLang, AppTheme, AppUser } from './types';
import type { LContextIn } from '@laser-ui/components/context';

import { useStorage } from '@laser-ui/admin';
import { ConfigProvider, Root } from '@laser-ui/components';
import { useMount } from '@laser-ui/hooks';
import { isNull } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LOGIN_PATH } from './configs/app';
import { STORAGE } from './configs/storage';
import { TOKEN, useHttp, useInit } from './core';
import AppRouter from './routes/Router';

const TOKEN_VALID = !isNull(TOKEN.value) && !TOKEN.expired;

function App() {
  const http = useHttp();
  const init = useInit();
  const navigate = useNavigate();
  const languageStorage = useStorage<AppLang>(...STORAGE.language);
  const themeStorage = useStorage<AppTheme>(...STORAGE.theme);

  const [loading, setLoading] = useState(TOKEN_VALID);

  useMount(() => {
    if (TOKEN_VALID) {
      http<AppUser>({
        url: '/auth/me',
        method: 'get',
      })
        .then((res) => {
          init(res);
        })
        .catch(() => {
          navigate(LOGIN_PATH);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate(LOGIN_PATH);
    }
  });

  useEffect(() => {
    document.documentElement.lang = languageStorage.value;
  }, [languageStorage.value]);

  const theme = themeStorage.value;
  useEffect(() => {
    for (const t of ['light', 'dark']) {
      document.body.classList.toggle(t, theme === t);
    }
    const colorScheme = document.documentElement.style.colorScheme;
    document.documentElement.style.colorScheme = theme;
    return () => {
      document.documentElement.style.colorScheme = colorScheme;
    };
  }, [theme]);

  const lContext = useMemo<LContextIn>(
    () => ({
      layoutPageScrollEl: '#app-main',
      layoutContentResizeEl: '#app-content',
    }),
    [],
  );
  const rootContext = useMemo(() => ({ i18n: { lang: languageStorage.value } }), [languageStorage.value]);

  return (
    <ConfigProvider context={lContext}>
      <Root context={rootContext}>{loading ? null : <AppRouter />}</Root>
    </ConfigProvider>
  );
}

export default App;
