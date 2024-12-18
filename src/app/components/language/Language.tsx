import type { AppLanguageProps } from './types';
import type { AppLang } from '../../types';
import type { DropdownItem } from '@laser-ui/components/dropdown/types';

import { useStorage } from '@laser-pro/storage';
import { Dropdown, Icon } from '@laser-ui/components';
import TranslateOutlined from '@material-design-icons/svg/outlined/translate.svg?react';
import { useTranslation } from 'react-i18next';

import { STORAGE } from '../../configs/storage';

export function AppLanguage(props: AppLanguageProps): React.ReactElement | null {
  const {
    trigger,

    ...restProps
  } = props;

  const languageStorage = useStorage(...STORAGE.language);
  const { t, i18n } = useTranslation();

  return (
    <Dropdown
      list={(
        [
          ['🇨🇳', '简体中文', 'zh-CN'],
          ['🇺🇸', 'English', 'en-US'],
        ] as [string, string, AppLang][]
      ).map<DropdownItem<AppLang>>((item) => ({
        id: item[2],
        title: (
          <>
            <div className="app-language__item-region">{item[0]}</div>
            <span className="app-language__item-lng">{item[1]}</span>
          </>
        ),
        type: 'item',
      }))}
      trigger={trigger}
      onClick={(id: AppLang) => {
        languageStorage.set(id);
        i18n.changeLanguage(id);
      }}
    >
      {(dropdownProps) => (
        <button {...restProps} {...dropdownProps} aria-label={t('components.language.Change language')}>
          <Icon size={20}>
            <TranslateOutlined />
          </Icon>
        </button>
      )}
    </Dropdown>
  );
}
