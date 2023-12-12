import { DialogService, Toast } from '@laser-ui/components';
import i18n from 'i18next';

export function handleStandardResponse(res: AppStandardResponse.Action<any>, cb?: { success?: () => void; error?: () => void }) {
  if (res.success) {
    DialogService.open(Toast, {
      children: i18n.t('Successful operation'),
      type: 'success',
    });
    cb?.success?.();
  } else {
    DialogService.open(Toast, {
      children: res.message,
      type: 'error',
    });
    cb?.error?.();
  }
}
