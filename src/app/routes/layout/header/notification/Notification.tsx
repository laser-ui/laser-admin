import type { TabsRef } from '@laser-ui/components/tabs';

import { Avatar, Badge, Button, Icon, Popover, Separator, Spinner, Tabs } from '@laser-ui/components';
import { classNames } from '@laser-ui/utils';
import NotificationsOutlined from '@material-design-icons/svg/outlined/notifications.svg?react';
import { isUndefined } from 'lodash';
import { useStore } from 'rcl-store';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { AppList } from './List';
import { URLS } from '../../../../configs/urls';
import { GlobalStore } from '../../../../core';

import styles from './Notification.module.scss';

export function AppNotification(props: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element | null {
  const tabsRef = useRef<TabsRef>(null);

  const [{ appNotifications }] = useStore(GlobalStore, ['appNotifications']);
  const { t } = useTranslation();

  const num = (() => {
    let n = 0;
    if (!isUndefined(appNotifications)) {
      appNotifications.forEach((notify) => {
        n += notify.list.filter((item) => !item.read).length;
      });
    }
    return n;
  })();

  return (
    <Popover
      className={styles['app-notification']}
      styleOverrides={{ popover__body: { style: isUndefined(appNotifications) ? { padding: '16px 32px' } : { width: 320, padding: 0 } } }}
      content={
        isUndefined(appNotifications) ? (
          <Spinner visible alone />
        ) : (
          <>
            <Tabs
              ref={tabsRef}
              list={appNotifications.map((notify) => ({
                id: notify.id,
                title: notify.title,
                panel: (
                  <AppList
                    list={notify.list.map((item, index) => ({
                      avatar: <Avatar img={{ src: URLS['/avatar.png'], alt: 'avatar' }} />,
                      title: 'name',
                      subtitle: index === 0 && new Date().toLocaleString(),
                      description: item.message,
                      props: {
                        className: classNames(styles['app-notification__item'], {
                          [styles['app-notification__item--read']]: item.read,
                        }),
                      },
                    }))}
                  />
                ),
              }))}
              center
            />
            <div className={styles['app-notification__actions']}>
              <Button style={{ flexGrow: 1 }} pattern="link">
                {t('routes.layout.Clear notifications')}
              </Button>
              <Separator style={{ margin: 0 }} vertical />
              <Button style={{ flexGrow: 1 }} pattern="link">
                {t('routes.layout.See more')}
              </Button>
            </div>
          </>
        )
      }
      trigger="click"
      placement="bottom-right"
      arrow={false}
      inWindow={10}
      afterVisibleChange={(visible) => {
        if (visible && tabsRef.current) {
          tabsRef.current.updateIndicator();
        }
      }}
    >
      <button {...props} aria-label={t('routes.layout.Notification')}>
        <div style={{ position: 'relative' }}>
          <Badge value={num} dot />
          <Icon size={20}>
            <NotificationsOutlined />
          </Icon>
        </div>
      </button>
    </Popover>
  );
}
