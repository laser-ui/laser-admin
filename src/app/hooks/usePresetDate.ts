import { useTranslation } from 'react-i18next';

export function usePresetDate() {
  const { t } = useTranslation();

  return {
    [t('Last day')]: () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return [date, new Date()];
    },
    [t('Last week')]: () => {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      return [date, new Date()];
    },
    [t('Last month')]: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return [date, new Date()];
    },
  } as any;
}
