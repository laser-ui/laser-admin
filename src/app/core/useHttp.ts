import { useHttp as useHttpCore } from '@laser-ui/admin';
import { DialogService, Toast } from '@laser-ui/components';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { LOGIN_PATH, PREV_ROUTE_KEY } from '../configs/app';

export function useHttp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return useHttpCore((error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          DialogService.open(Toast, {
            children: t('User not authorized'),
            type: 'error',
          });
          navigate(LOGIN_PATH, { state: { [PREV_ROUTE_KEY]: location } });
          break;

        case 403:
        case 404:
        case 500:
          if (location.pathname !== LOGIN_PATH) {
            navigate(`/exception/${error.response.status}`);
          }
          break;

        default:
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received.
    } else {
      // Something happened in setting up the request that triggered an Error.
    }
  });
}
