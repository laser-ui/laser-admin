import type { LContextIn } from '@laser-ui/components/context';

import { useStorage } from '@laser-pro/storage';
import { ConfigProvider, Root } from '@laser-ui/components';
import { useEffect, useMemo } from 'react';

import { STORAGE } from './configs/storage';
import AppRouter from './routes/Router';

function App() {
  const languageStorage = useStorage(...STORAGE.language);
  const themeStorage = useStorage(...STORAGE.theme);

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
      <Root context={rootContext}>
        <AppRouter />
      </Root>
    </ConfigProvider>
  );
}

export default App;
