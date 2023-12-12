import { Separator } from '@laser-ui/components';
import { checkNodeExist, classNames } from '@laser-ui/utils';
import { Fragment } from 'react';

import styles from './List.module.scss';

interface AppListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  list: {
    avatar?: React.ReactNode;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    description?: React.ReactNode;
    props?: React.HTMLAttributes<HTMLLIElement>;
  }[];
  separator?: boolean;
}

export function AppList(props: AppListProps): JSX.Element | null {
  const {
    list,
    separator = true,

    ...restProps
  } = props;

  return (
    <ul {...restProps} className={classNames(restProps.className, styles['app-list'])}>
      {list.map(({ avatar, title, subtitle, description, props }, index) => (
        <Fragment key={index}>
          <li {...props} className={classNames(props?.className, styles['app-list__item'])}>
            {checkNodeExist(avatar) && <div className={styles['app-list__avatar']}>{avatar}</div>}
            <div className={styles['app-list__content']}>
              {checkNodeExist(title) && <div className={styles['app-list__title']}>{title}</div>}
              {checkNodeExist(subtitle) && <div className={styles['app-list__subtitle']}>{subtitle}</div>}
              {checkNodeExist(description) && <div className={styles['app-list__description']}>{description}</div>}
            </div>
          </li>
          {separator && index !== list.length - 1 && <Separator style={{ margin: 0 }} />}
        </Fragment>
      ))}
    </ul>
  );
}
