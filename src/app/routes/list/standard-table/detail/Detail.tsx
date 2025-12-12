import { Button, Card, DialogService, Icon, Separator, Spinner, Table } from '@laser-ui/components';
import EditOutlined from '@material-design-icons/svg/outlined/edit.svg?react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { AppDetailView, AppRouteHeader } from '../../../../components';
import { useDeviceQuery } from '../../../../queries/device';
import { AppDeviceModal } from '../DeviceModal';

import styles from './Detail.module.scss';

export default function Detail() {
  const { t } = useTranslation();

  const params = useParams();
  const id = Number(params['id']);

  const { deviceQuery } = useDeviceQuery(id);

  return (
    <>
      <AppRouteHeader>
        <AppRouteHeader.Breadcrumb
          list={[
            { id: '/list', title: t('List', { ns: 'title' }) },
            {
              id: '/list/standard-table',
              title: t('Standard table', { ns: 'title' }),
              link: true,
            },
            { id: '/list/standard-table/:id', title: t('Device detail', { ns: 'title' }) },
          ]}
        />
        <AppRouteHeader.Header
          actions={[
            <Button
              icon={
                <Icon>
                  <EditOutlined />
                </Icon>
              }
              disabled={!deviceQuery.isSuccess}
              onClick={() => {
                DialogService.open(AppDeviceModal, {
                  device: deviceQuery.data,
                });
              }}
            >
              {t('Edit')}
            </Button>,
          ]}
          back
        />
      </AppRouteHeader>
      <div className={styles['app-detail']}>
        {deviceQuery.isPending ? (
          <div className="flex justify-center">
            <Spinner visible alone></Spinner>
          </div>
        ) : (
          <>
            <Spinner visible={deviceQuery.isFetching}></Spinner>
            <Card>
              <Card.Content>
                <div className="app-title mb-3">Title 1</div>
                <AppDetailView
                  list={Array.from({ length: 5 }).map((_, n) => ({
                    label: `Label ${n === 0 ? 'First' : n}`,
                    content: n === 1 ? null : n === 3 ? 'This is a long long long long long long long long text' : `Content ${n}`,
                  }))}
                  gutter={3}
                />
                <Separator />
                <div className="app-title mb-3">Title 2</div>
                <AppDetailView
                  list={Array.from({ length: 5 }).map((_, n) => ({
                    label: `Label ${n}`,
                    content: n === 1 ? null : n === 3 ? 'This is a long long long long long long long long text' : `Content ${n}`,
                  }))}
                  gutter={3}
                  vertical
                />
              </Card.Content>
            </Card>
            <Card className="mt-4">
              <Card.Header>Title</Card.Header>
              <Card.Content>
                <Table style={{ overflow: 'auto hidden' }}>
                  <table style={{ minWidth: 600 }}>
                    <thead>
                      <tr>
                        {Array.from({ length: 4 }).map((_, n) => (
                          <Table.Th key={n}>Name {n}</Table.Th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 3 }).map((_, n1) => (
                        <tr key={n1}>
                          {Array.from({ length: 4 }).map((_, n2) => (
                            <Table.Td key={n2}>Content {n2}</Table.Td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Table>
              </Card.Content>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
