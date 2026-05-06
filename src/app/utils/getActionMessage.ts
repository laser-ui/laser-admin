import i18n from 'i18next';

export function getActionMessage(res: { message?: string; messageI18n?: string }): string {
  if (res.messageI18n) {
    return i18n.t(`apiMessages.${res.messageI18n}` as any);
  }
  return res.message ?? '';
}
