import { useTranslation } from 'react-i18next';

export function usePresetDate() {
  const { t } = useTranslation();

  return {
    [t('lastDay')]: () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return [date, new Date()];
    },
    [t('lastWeek')]: () => {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      return [date, new Date()];
    },
    [t('lastMonth')]: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return [date, new Date()];
    },
    [t('last3Months')]: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return [date, new Date()];
    },
    [t('last6Months')]: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 6);
      return [date, new Date()];
    },
    [t('lastYear')]: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 12);
      return [date, new Date()];
    },
  } as any;
}
