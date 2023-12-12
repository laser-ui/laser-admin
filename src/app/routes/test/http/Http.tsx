import { Button, Card } from '@laser-ui/components';
import { useTranslation } from 'react-i18next';

import { AppRouteHeader } from '../../../components';
import { useHttp } from '../../../core';

import styles from './Http.module.scss';

export default function Http() {
  const http = useHttp();
  const { t } = useTranslation();

  return (
    <>
      <AppRouteHeader>
        <AppRouteHeader.Breadcrumb
          list={[
            { id: '/test', title: t('Test', { ns: 'title' }) },
            { id: '/test/http', title: t('Http', { ns: 'title' }) },
          ]}
        />
        <AppRouteHeader.Header />
      </AppRouteHeader>
      <div className={styles['app-http']}>
        <Card>
          <Card.Content>
            <div className={styles['app-http__button-container']}>
              {[401, 403, 404, 500].map((status) => (
                <Button
                  key={status}
                  onClick={() => {
                    http({
                      url: '/test/http',
                      method: 'post',
                      data: { status },
                    });
                  }}
                >
                  {status}
                </Button>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </>
  );
}
