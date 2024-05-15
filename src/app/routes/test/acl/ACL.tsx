import { useACL } from '@laser-ui/admin';
import { Alert, Button, Card, Table, Tag } from '@laser-ui/components';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRouteHeader } from '../../../components';

import styles from './ACL.module.scss';

export default function ACL() {
  const acl = useACL();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <AppRouteHeader>
        <AppRouteHeader.Breadcrumb
          list={[
            { id: '/test', title: t('Test', { ns: 'title' }) },
            { id: '/test/acl', title: t('ACL', { ns: 'title' }) },
          ]}
        />
        <AppRouteHeader.Header />
      </AppRouteHeader>
      <div className={styles['app-acl']}>
        <Alert type="info">{t('routes.test.acl.Switch between different users to compare effects')}</Alert>
        <Table border>
          <table>
            <caption>{t('routes.test.acl.ACL Data')}</caption>
            <tbody>
              <tr>
                <Table.Th>Full</Table.Th>
                <Table.Td>{String(acl.full)}</Table.Td>
              </tr>
              <tr>
                <Table.Th>Controls</Table.Th>
                <Table.Td>{acl.controls.join(', ') || '-'}</Table.Td>
              </tr>
            </tbody>
          </table>
        </Table>
        <Card>
          <Card.Content>
            <div className={styles['app-acl__button-container']}>
              {[0, 1].map((control) => (
                <Fragment key={control}>{acl.can(control) && <Tag theme="primary">control-{control}</Tag>}</Fragment>
              ))}
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Button
              onClick={() => {
                navigate('/dashboard/echarts');
              }}
            >
              {t('routes.test.acl.Test Route Guard')}
            </Button>
          </Card.Content>
        </Card>
      </div>
    </>
  );
}
