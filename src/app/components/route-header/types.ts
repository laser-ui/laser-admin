import type { BreadcrumbItem } from '@laser-ui/components/breadcrumb/types';

export {};

export interface AppRouteHeaderHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  back?: boolean;
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
}

export type AppBreadcrumbItem = BreadcrumbItem<string> & { skipRenderLink?: boolean };

export interface AppRouteHeaderBreadcrumbProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: AppBreadcrumbItem[];
  home?: AppBreadcrumbItem;
  separator?: React.ReactNode;
}
