import { Drawer, Menu } from '@laser-ui/components';
import { useStorage } from '@laser-ui/hooks';
import { classNames } from '@laser-ui/utils';

import { STORAGE_KEY } from '../../../configs/storage';
import { useMenu } from '../../../core';

import styles from './Sidebar.module.scss';

interface AppSidebarProps {
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

export function AppSidebar(props: AppSidebarProps): JSX.Element | null {
  const { menuOpen, onMenuOpenChange } = props;

  const layoutStorage = useStorage(...STORAGE_KEY.layout, 'json');

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

  return (
    <>
      <Drawer
        className="d-md-none"
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
      <div className={classNames(styles['app-sidebar'], 'd-none d-md-block')}>{menuNode(true)}</div>
    </>
  );
}
