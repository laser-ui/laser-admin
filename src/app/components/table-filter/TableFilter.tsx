import type { AppTableFilterProps } from './types';

import { Badge, Button, Icon, Input, Separator } from '@laser-ui/components';
import { classNames } from '@laser-ui/utils';
import ExpandMoreOutlined from '@material-design-icons/svg/outlined/expand_more.svg?react';
import { cloneElement, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { checkEmpty } from '../../utils';

export function AppTableFilter(props: AppTableFilterProps): JSX.Element | null {
  const {
    filterList,
    searchValue,
    searchPlaceholder,
    onSearchValueChange,
    onSearchClick,
    onResetClick,

    ...restProps
  } = props;

  const { t } = useTranslation();

  const badgeValue = filterList ? filterList.filter(({ value }) => !checkEmpty(value)).length : 0;

  const searchWithFilter = useRef(searchValue || badgeValue > 0 ? true : false);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  return (
    <div {...restProps} className={classNames(restProps.className, 'app-table-filter')}>
      <div className="app-table-filter__search">
        <Input
          className="app-table-filter__search-input"
          model={searchValue}
          placeholder={searchPlaceholder}
          inputRender={(el) =>
            cloneElement<React.InputHTMLAttributes<HTMLInputElement>>(el, {
              onKeyDown: (e) => {
                el.props.onKeyDown?.(e);

                if (e.code === 'Enter') {
                  e.preventDefault();
                  onSearchClick?.();
                }
              },
            })
          }
          onModelChange={onSearchValueChange}
        />
        <div className="app-table-filter__button-container">
          <Button
            onClick={() => {
              searchWithFilter.current = searchValue || badgeValue > 0 ? true : false;
              setShowAdvancedSearch(false);
              onSearchClick?.();
            }}
          >
            {t('components.table-filter.Search')}
          </Button>
          <Button
            pattern="secondary"
            disabled={!searchValue && badgeValue === 0}
            onClick={() => {
              onResetClick?.(searchWithFilter.current);
              searchWithFilter.current = false;
            }}
          >
            {t('Reset')}
          </Button>
          {filterList && (
            <div className="d-flex align-items-center">
              <Button
                className="me-2"
                pattern="link"
                onClick={() => {
                  setShowAdvancedSearch((prevShowAdvancedSearch) => !prevShowAdvancedSearch);
                }}
              >
                <div className="d-flex align-items-center">
                  {t('components.table-filter.Advanced Search')}
                  <Icon className="ms-1" size={12} rotate={showAdvancedSearch ? 180 : 0}>
                    <ExpandMoreOutlined />
                  </Icon>
                </div>
              </Button>
              <Badge value={badgeValue} theme="primary" alone />
            </div>
          )}
        </div>
      </div>
      {filterList && (
        <div style={{ display: showAdvancedSearch ? undefined : 'none' }}>
          <Separator />
          {filterList.map(({ label, node }) => (
            <div key={label} className="app-table-filter__filter">
              <label className="app-table-filter__filter-label">{label}</label>
              {node}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
