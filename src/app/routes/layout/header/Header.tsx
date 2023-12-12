import type { AppTheme } from '../../../types';

import { Icon } from '@laser-ui/components';
import { useStorage } from '@laser-ui/hooks';
import { classNames } from '@laser-ui/utils';
import DarkModeOutlined from '@material-design-icons/svg/outlined/dark_mode.svg?react';
import FormatIndentDecreaseOutlined from '@material-design-icons/svg/outlined/format_indent_decrease.svg?react';
import FormatIndentIncreaseOutlined from '@material-design-icons/svg/outlined/format_indent_increase.svg?react';
import LightModeOutlined from '@material-design-icons/svg/outlined/light_mode.svg?react';
import SearchOutlined from '@material-design-icons/svg/outlined/search.svg?react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AppNotification } from './notification/Notification';
import { AppUser } from './user/User';
import { AppLanguage } from '../../../components';
import { APP_NAME } from '../../../configs/app';
import { STORAGE_KEY } from '../../../configs/storage';
import { URLS } from '../../../configs/urls';

import styles from './Header.module.scss';

interface AppHeaderProps {
  sidebarWidth: number;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

export function AppHeader(props: AppHeaderProps): JSX.Element | null {
  const { sidebarWidth, menuOpen, onMenuOpenChange } = props;

  const textRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  const themeStorage = useStorage<AppTheme>(...STORAGE_KEY.theme);
  const layoutStorage = useStorage(...STORAGE_KEY.layout, 'json');

  useEffect(() => {
    if (layoutStorage.value.menu.mode === 'vertical' && textRef.current) {
      const maxWidth = sidebarWidth - 64 - 14;
      if (textRef.current.scrollWidth > maxWidth) {
        textRef.current.style.transform = `scale(${maxWidth / textRef.current.scrollWidth})`;
      } else {
        textRef.current.style.transform = '';
      }
    }
  });

  return (
    <header className={styles['app-header']}>
      <Link className={styles['app-header__logo-container']} to="/">
        <div className={styles['app-header__logo']}>
          <img src={URLS['/logo.png']} alt="Logo" width="36" height="36" />
        </div>
        <div
          className={classNames(styles['app-header__logo-title-wrapper'], 'd-none d-md-block')}
          style={{ width: layoutStorage.value.menu.mode === 'vertical' ? sidebarWidth - 64 : 0 }}
        >
          <div className={styles['app-header__logo-title']} ref={textRef}>
            {APP_NAME}
          </div>
        </div>
      </Link>
      <button
        className={classNames(styles['app-header__button'], 'd-md-none')}
        aria-label={t(menuOpen ? 'routes.layout.Fold main navigation' : 'routes.layout.Expand main navigation')}
        onClick={() => {
          onMenuOpenChange(!menuOpen);
        }}
      >
        <Icon size={20}>{menuOpen ? <FormatIndentDecreaseOutlined /> : <FormatIndentIncreaseOutlined />}</Icon>
      </button>
      <button
        className={classNames(styles['app-header__button'], 'd-none d-md-inline-flex')}
        aria-label={t(
          layoutStorage.value.menu.mode === 'vertical' ? 'routes.layout.Fold main navigation' : 'routes.layout.Expand main navigation',
        )}
        onClick={() => {
          const layout = JSON.parse(JSON.stringify(layoutStorage.value));
          layout.menu.mode = layout.menu.mode === 'vertical' ? 'icon' : 'vertical';
          layoutStorage.set(layout);
        }}
      >
        <Icon size={20}>
          {layoutStorage.value.menu.mode === 'vertical' ? <FormatIndentDecreaseOutlined /> : <FormatIndentIncreaseOutlined />}
        </Icon>
      </button>
      <button
        className={styles['app-header__button']}
        aria-label={t(themeStorage.value === 'light' ? 'Dark theme' : 'Light theme')}
        onClick={() => {
          themeStorage.set(themeStorage.value === 'light' ? 'dark' : 'light');
        }}
      >
        <Icon size={20}>{themeStorage.value === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}</Icon>
      </button>
      <button className={classNames(styles['app-header__button'], 'ms-auto')} aria-label={t('routes.layout.Search')}>
        <Icon size={20}>
          <SearchOutlined />
        </Icon>
      </button>
      <AppNotification className={styles['app-header__button']} />
      <AppUser className={styles['app-header__button']} style={{ gap: '0 8px' }} />
      <AppLanguage className={styles['app-header__button']} trigger="click" />
    </header>
  );
}
