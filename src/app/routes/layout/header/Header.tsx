import { useStorage } from '@laser-pro/storage';
import { Icon } from '@laser-ui/components';
import { useIsomorphicLayoutEffect } from '@laser-ui/hooks';
import { classNames } from '@laser-ui/utils';
import DarkModeOutlined from '@material-design-icons/svg/outlined/dark_mode.svg?react';
import FormatIndentDecreaseOutlined from '@material-design-icons/svg/outlined/format_indent_decrease.svg?react';
import FormatIndentIncreaseOutlined from '@material-design-icons/svg/outlined/format_indent_increase.svg?react';
import LightModeOutlined from '@material-design-icons/svg/outlined/light_mode.svg?react';
import SearchOutlined from '@material-design-icons/svg/outlined/search.svg?react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AppNotification } from './notification/Notification';
import { AppUser } from './user/User';
import logoUrl from '../../../../assets/logo.png';
import { AppLanguage } from '../../../components';
import { APP_NAME } from '../../../configs/app';
import { STORAGE } from '../../../configs/storage';
import { useMatchMedia } from '../../../hooks';

import styles from './Header.module.scss';

interface AppHeaderProps {
  sidebarWidth: number;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

export function AppHeader(props: AppHeaderProps): React.ReactElement | null {
  const { sidebarWidth, menuOpen, onMenuOpenChange } = props;

  const textRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  const themeStorage = useStorage(...STORAGE.theme);
  const layoutStorage = useStorage(...STORAGE.layout);
  const { mediaBreakpointUp } = useMatchMedia();

  useIsomorphicLayoutEffect(() => {
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
          <img src={logoUrl} alt="Logo" width="36" height="36" />
        </div>
        <div
          className={classNames(styles['app-header__logo-title-wrapper'], 'd-none d-md-block')}
          style={{ width: layoutStorage.value.menu.mode === 'vertical' ? sidebarWidth - 64 : 0 }}
        >
          <div
            className={styles['app-header__logo-title']}
            ref={(instance) => {
              textRef.current = instance;
              return () => {
                textRef.current = null;
              };
            }}
          >
            {APP_NAME}
          </div>
        </div>
      </Link>
      {mediaBreakpointUp('md') ? (
        <button
          className={styles['app-header__button']}
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
      ) : (
        <button
          className={styles['app-header__button']}
          aria-label={t(menuOpen ? 'routes.layout.Fold main navigation' : 'routes.layout.Expand main navigation')}
          onClick={() => {
            onMenuOpenChange(!menuOpen);
          }}
        >
          <Icon size={20}>{menuOpen ? <FormatIndentDecreaseOutlined /> : <FormatIndentIncreaseOutlined />}</Icon>
        </button>
      )}
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
