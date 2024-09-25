import type { TabsRef } from '@laser-ui/components/tabs';

import { Avatar, Badge, Button, Empty, Icon, Popover, Separator, Spinner, Tabs, Tag } from '@laser-ui/components';
import { classNames } from '@laser-ui/utils';
import NotificationsOutlined from '@material-design-icons/svg/outlined/notifications.svg?react';
import { isUndefined } from 'lodash';
import { useStore } from 'rcl-store';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import avatarUrl from '../../../../../assets/avatar.png';
import { AppList } from '../../../../components';
import { GlobalStore } from '../../../../core';

import styles from './Notification.module.scss';

export function AppNotification(props: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element | null {
  const tabsRef = useRef<TabsRef>(null);

  const [{ appNotifications }] = useStore(GlobalStore, ['appNotifications']);
  const { t } = useTranslation();

  const num = (() => {
    let n = 0;
    if (!isUndefined(appNotifications)) {
      appNotifications.forEach((notification) => {
        n += notification.filter((item) => !item.read).length;
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
              list={Array.from({ length: 3 }).map((_, index) => ({
                id: index,
                title: 'Title',
                panel:
                  appNotifications[index].length === 0 ? (
                    <Empty className="mb-3" />
                  ) : (
                    <AppList
                      list={(appNotifications[index] as { message: string; read: boolean }[]).map((notification, index) => ({
                        avatar: <Avatar img={{ src: avatarUrl, alt: 'avatar' }} />,
                        title: 'Name',
                        extra: <Tag theme={index === 0 ? undefined : 'success'}>{index === 0 ? 'Pending' : 'Processed'}</Tag>,
                        description: notification.message,
                        footer: index === 0 && new Date().toLocaleString(),
                        props: {
                          className: classNames(styles['app-notification__item'], {
                            [styles['app-notification__item--read']]: notification.read,
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
