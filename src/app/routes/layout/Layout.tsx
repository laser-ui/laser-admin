import { useStorage } from '@laser-ui/hooks';
import { classNames } from '@laser-ui/utils';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AppHeader } from './header/Header';
import { AppSidebar } from './sidebar/Sidebar';
import { STORAGE_KEY } from '../../configs/storage';

import styles from './Layout.module.scss';

export interface AppLayoutProps {
  sidebar?: {
    width?: number;
  };
}

const SIDEBAR_DEFAULT = {
  width: 200,
};

export default function Layout(props: AppLayoutProps): JSX.Element | null {
  const { sidebar } = props;

  const layoutStorage = useStorage(...STORAGE_KEY.layout, 'json');

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <AppHeader sidebarWidth={sidebar?.width ?? SIDEBAR_DEFAULT.width} menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <section className={classNames(styles['app-layout'], styles[`app-layout--menu-${layoutStorage.value.menu.mode}`])}>
        <AppSidebar menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
        <main id="app-main" className={styles['app-layout__content']}>
          <section id="app-content">
            <Outlet />
          </section>
        </main>
      </section>
    </>
  );
}
