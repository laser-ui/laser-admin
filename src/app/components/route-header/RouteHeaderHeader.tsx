import type { AppRouteHeaderHeaderProps } from './types';

import { RouterContext } from '@laser-pro/router/context';
import { Icon } from '@laser-ui/components';
import { classNames } from '@laser-ui/utils';
import ArrowBackOutlined from '@material-design-icons/svg/outlined/arrow_back.svg?react';
import { has } from 'lodash';
import { Fragment, use } from 'react';
import { useNavigate } from 'react-router';

export function AppRouteHeaderHeader(props: AppRouteHeaderHeaderProps): React.ReactElement | null {
  const {
    children,
    back = false,
    actions,

    ...restProps
  } = props;

  const { title } = use(RouterContext);

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
      {actions && (
        <div className="app-route-header__header-actions">
          {actions.map((node, index) => {
            const { id, action } = (has(node, ['id', 'action']) ? node : { id: index, action: node }) as {
              id: React.Key;
              action: React.ReactNode;
            };
            return <Fragment key={id}>{action}</Fragment>;
          })}
        </div>
      )}
    </div>
  );
}
