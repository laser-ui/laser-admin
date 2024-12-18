import type { AppBreadcrumbItem, AppRouteHeaderBreadcrumbProps } from './types';

import { Breadcrumb } from '@laser-ui/components';
import { classNames } from '@laser-ui/utils';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function AppRouteHeaderBreadcrumb(props: AppRouteHeaderBreadcrumbProps): React.ReactElement | null {
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
          title: item.link && !item.skipRenderLink ? <Link to={item.id}>{item.title}</Link> : item.title,
        }))}
        separator={separator}
      />
    </div>
  );
}
