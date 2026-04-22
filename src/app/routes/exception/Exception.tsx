import { Button } from '@laser-ui/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import S403 from './403.svg?react';
import S404 from './404.svg?react';
import S500 from './500.svg?react';

import styles from './Exception.module.scss';

export default function Exception(): React.ReactElement | null {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { status } = useParams();

  const BG = status === '403' ? S403 : status === '404' ? S404 : S500;

  const messages: Record<string, string> = {
    '403': t('routes.exception.e403'),
    '404': t('routes.exception.e404'),
    '500': t('routes.exception.e500'),
  };

  return (
    <div className={styles['app-exception']}>
      <BG className={styles['app-exception__bg']} />
      <div className={styles['app-exception__info']}>
        <div className={styles['app-exception__status']}>{status}</div>
        <div className={styles['app-exception__description']}>{messages[status ?? '404']}</div>
        <Button
          onClick={() => {
            navigate('/', { replace: true });
          }}
        >
          {t('routes.exception.backHome')}
        </Button>
      </div>
    </div>
  );
}
