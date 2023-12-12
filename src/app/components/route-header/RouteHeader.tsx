import { classNames } from '@laser-ui/utils';

import { AppRouteHeaderBreadcrumb } from './RouteHeaderBreadcrumb';
import { AppRouteHeaderHeader } from './RouteHeaderHeader';

export const AppRouteHeader: {
  (props: React.HTMLAttributes<HTMLDivElement>): JSX.Element | null;
  Breadcrumb: typeof AppRouteHeaderBreadcrumb;
  Header: typeof AppRouteHeaderHeader;
} = (props) => {
  const {
    children,

    ...restProps
  } = props;

  return (
    <div {...restProps} className={classNames(restProps.className, 'app-route-header')}>
      {children}
    </div>
  );
};

AppRouteHeader.Breadcrumb = AppRouteHeaderBreadcrumb;
AppRouteHeader.Header = AppRouteHeaderHeader;
