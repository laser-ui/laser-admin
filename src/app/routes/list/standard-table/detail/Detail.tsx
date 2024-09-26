import type { DeviceData } from '../types';

import { Button, Card, DialogService, Icon, Separator, Spinner, Table } from '@laser-ui/components';
import { useMount } from '@laser-ui/hooks';
import EditOutlined from '@material-design-icons/svg/outlined/edit.svg?react';
import { isUndefined } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { AppDetailView, AppRouteHeader } from '../../../../components';
import { useHttp } from '../../../../core';
import { AppDeviceModal } from '../DeviceModal';

import styles from './Detail.module.scss';

export default function Detail() {
  const { t } = useTranslation();

  const http = useHttp();

  const params = useParams();
  const id = Number(params['id']);

  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<DeviceData>();

  const requestDevice = () => {
    setLoading(true);
    http({
      url: `/device/${id}`,
      method: 'get',
    }).then((res) => {
      setLoading(false);
      setDevice(res);
    });
  };

  useMount(() => {
    requestDevice();
  });

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
              disabled={!device}
              onClick={() => {
                DialogService.open(AppDeviceModal, {
                  device,
                  onSuccess: () => {
                    requestDevice();
                  },
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
        {isUndefined(device) ? (
          <div className="d-flex justify-content-center">
            <Spinner visible alone></Spinner>
          </div>
        ) : (
          <>
            <Spinner visible={loading}></Spinner>
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
            <Card className="mt-3">
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
