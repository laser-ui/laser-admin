import type { AppRouteHeaderHeaderProps } from './types';

import { RouterContext } from '@laser-ui/admin/packages/router/context';
import { Icon } from '@laser-ui/components';
import { classNames } from '@laser-ui/utils';
import ArrowBackOutlined from '@material-design-icons/svg/outlined/arrow_back.svg?react';
import { Children, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export function AppRouteHeaderHeader(props: AppRouteHeaderHeaderProps): JSX.Element | null {
  const {
    children,
    back = false,
    actions,

    ...restProps
  } = props;

  const { title } = useContext(RouterContext);

  const navigate = useNavigate();

  return (
    <div {...restProps} className={classNames(restProps.className, 'app-route-header__header')}>
      <div className="app-route-header__header-title-container">
        {back && (
          <button
            className="app-route-header__header-back"
            onClick={() => {
              navigate(-1);
            }}
          >
            <Icon size={20}>
              <ArrowBackOutlined />
            </Icon>
          </button>
        )}
        <div className="app-route-header__header-title">{children ?? title}</div>
      </div>
      <div className="app-route-header__header-actions">{Children.map(actions, (action) => action)}</div>
    </div>
  );
}
