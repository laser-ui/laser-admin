import type { AppBreadcrumbItem, AppRouteHeaderBreadcrumbProps } from './types';

import { Breadcrumb } from '@laser-ui/components';
import { classNames } from '@laser-ui/utils';
import { cloneElement, isValidElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function AppRouteHeaderBreadcrumb(props: AppRouteHeaderBreadcrumbProps): JSX.Element | null {
  const {
    list,
    home: _home,
    separator,

    ...restProps
  } = props;

  const { t } = useTranslation();

  const home: AppBreadcrumbItem = _home ?? {
    id: '/',
    title: t('Home', { ns: 'title' }),
    link: true,
  };

  return (
    <div {...restProps} className={classNames(restProps.className, 'app-route-header__breadcrumb')}>
      <Breadcrumb
        list={[home].concat(list).map((item) => ({
          ...item,
          title:
            item.link && !item.skipRenderLink ? (
              <Link className="app-route-header__breadcrumb-link" to={item.id}>
                {item.title}
              </Link>
            ) : isValidElement(item.title) ? (
              cloneElement<React.HTMLAttributes<HTMLElement>>(item.title as any, {
                className: classNames(
                  item.title.props.className,
                  item.title.type === Link ? 'app-route-header__breadcrumb-link' : undefined,
                ),
              })
            ) : (
              <div>{item.title}</div>
            ),
        }))}
        separator={separator}
      />
    </div>
  );
}
