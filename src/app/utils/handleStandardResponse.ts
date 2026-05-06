import { DialogService, Toast } from '@laser-ui/components';
import i18n from 'i18next';

import { getActionMessage } from './getActionMessage';

export function handleStandardResponse(res: AppStandardResponse.Action<any>, cb?: { success?: () => void; error?: () => void }) {
  if (res.success) {
    DialogService.open(Toast, {
      children: i18n.t('success'),
      type: 'success',
    });
    cb?.success?.();
  } else {
    DialogService.open(Toast, {
      children: getActionMessage(res),
      type: 'error',
    });
    cb?.error?.();
  }
}
