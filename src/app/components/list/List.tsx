import type { AppListProps } from './types';

import { Separator } from '@laser-ui/components';
import { checkNodeExist, classNames } from '@laser-ui/utils';
import { Fragment } from 'react';

export function AppList(props: AppListProps): React.ReactElement | null {
  const {
    list,
    separator = true,

    ...restProps
  } = props;

  return (
    <ul {...restProps} className={classNames(restProps.className, 'app-list')}>
      {list.map(({ title, avatar, extra, description, footer, props }, index) => (
        <Fragment key={index}>
          <li {...props} className={classNames(props?.className, 'app-list__item')}>
            {checkNodeExist(avatar) && <div className="app-list__avatar">{avatar}</div>}
            <div className="app-list__content">
              <div className="app-list__header">
                <div className="app-list__title">{title}</div>
                {checkNodeExist(extra) && <div className="app-list__extra">{extra}</div>}
              </div>
              {checkNodeExist(description) && <div className="app-list__description">{description}</div>}
              {checkNodeExist(footer) && <div className="app-list__footer">{footer}</div>}
            </div>
          </li>
          {separator && index !== list.length - 1 && <Separator style={{ margin: 0 }} />}
        </Fragment>
      ))}
    </ul>
  );
}
