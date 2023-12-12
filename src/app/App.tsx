import type { AppLang, AppTheme, AppUser } from './types';
import type { LContextIn } from '@laser-ui/components/context';

import { ConfigProvider, Root } from '@laser-ui/components';
import { useStorage } from '@laser-ui/hooks';
import { isNull } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LOGIN_PATH } from './configs/app';
import { STORAGE_KEY } from './configs/storage';
import { TOKEN_ENABLE } from './configs/token';
import { TOKEN, useHttp, useInit } from './core';
import AppRoutes from './routes/Routes';

function App() {
  const http = useHttp();
  const init = useInit();
  const navigate = useNavigate();
  const languageStorage = useStorage<AppLang>(...STORAGE_KEY.language);
  const themeStorage = useStorage<AppTheme>(...STORAGE_KEY.theme);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (TOKEN_ENABLE && !isNull(TOKEN.value) && !TOKEN.expired) {
      http<AppUser>({
        url: '/auth/me',
        method: 'get',
      })[0]
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
      setLoading(false);
    }
  }, []);

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
      <Root context={rootContext}>{loading ? null : <AppRoutes />}</Root>
    </ConfigProvider>
  );
}

export default App;
