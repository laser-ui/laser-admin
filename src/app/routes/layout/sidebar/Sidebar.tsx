import { useStorage } from '@laser-pro/storage';
import { Drawer, Menu } from '@laser-ui/components';

import { STORAGE } from '../../../configs/storage';
import { useMenu } from '../../../core';
import { useMatchMedia } from '../../../hooks';

import styles from './Sidebar.module.scss';

interface AppSidebarProps {
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

export function AppSidebar(props: AppSidebarProps): React.ReactElement | null {
  const { menuOpen, onMenuOpenChange } = props;

  const layoutStorage = useStorage(...STORAGE.layout);
  const { mediaBreakpointUp } = useMatchMedia();

  const [{ menu, active, expands }, setMenu] = useMenu();

  const menuNode = (md: boolean) => (
    <Menu
      width={md ? 200 : '100%'}
      list={menu}
      mode={md ? layoutStorage.value.menu.mode : 'vertical'}
      active={active?.path}
      expands={expands}
      onExpandsChange={(expands) => {
        setMenu((draft) => {
          draft.expands = expands;
        });
      }}
    />
  );

  return mediaBreakpointUp('md') ? (
    <div className={styles['app-sidebar']}>{menuNode(true)}</div>
  ) : (
    <Drawer
      styleOverrides={{ drawer__body: { style: { padding: 0 } } }}
      visible={menuOpen}
      width={200}
      placement="left"
      onClose={() => {
        onMenuOpenChange(false);
      }}
    >
      {menuNode(false)}
    </Drawer>
  );
}
