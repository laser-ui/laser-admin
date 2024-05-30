import { Avatar, DialogService, Dropdown, Icon } from '@laser-ui/components';
import LockOutlined from '@material-design-icons/svg/outlined/lock.svg?react';
import LogoutOutlined from '@material-design-icons/svg/outlined/logout.svg?react';
import PersonOutlined from '@material-design-icons/svg/outlined/person.svg?react';
import SettingsOutlined from '@material-design-icons/svg/outlined/settings.svg?react';
import { useStore } from 'rcl-store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppAccountModal } from './AccountModal';
import { AppPasswordModal } from './PasswordModal';
import { LOGIN_PATH } from '../../../../configs/router';
import { GlobalStore, TOKEN } from '../../../../core';

export function AppUser(props: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element | null {
  const [{ appUser }] = useStore(GlobalStore, ['appUser']);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Dropdown
      styleOverrides={{ 'dropdown-popup': { style: { minWidth: 160 } } }}
      list={[
        {
          id: 'center',
          title: t('routes.layout.Account Center'),
          type: 'item',
          icon: (
            <Icon>
              <PersonOutlined />
            </Icon>
          ),
        },
        {
          id: 'setting',
          title: t('routes.layout.Account Settings'),
          type: 'item',
          icon: (
            <Icon>
              <SettingsOutlined />
            </Icon>
          ),
        },
        {
          id: 'password',
          title: t('routes.layout.Change Password'),
          type: 'item',
          icon: (
            <Icon>
              <LockOutlined />
            </Icon>
          ),
        },
        {
          id: 'logout',
          title: t('routes.layout.Logout'),
          type: 'item',
          icon: (
            <Icon>
              <LogoutOutlined />
            </Icon>
          ),
          separator: true,
        },
      ]}
      trigger="click"
      onClick={(id) => {
        switch (id) {
          case 'setting': {
            DialogService.open(AppAccountModal, {});
            break;
          }

          case 'password': {
            DialogService.open(AppPasswordModal, {});
            break;
          }

          case 'logout': {
            TOKEN.remove();
            navigate(LOGIN_PATH);
            break;
          }

          default:
            break;
        }
      }}
    >
      <button {...props} aria-label={t('routes.layout.My account')}>
        <Avatar
          img={appUser.avatar ? { src: appUser.avatar.path, alt: t('Avatar') } : undefined}
          text={appUser.name[0].toUpperCase()}
          size={28}
        />
        <span className="d-none d-md-block">{appUser.name}</span>
      </button>
    </Dropdown>
  );
}
