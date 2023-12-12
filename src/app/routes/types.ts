import type { ROUTES } from './vars';
import type { Control, ControlMode } from '@laser-ui/hooks/useACL';
import type { IndexRouteObject, NonIndexRouteObject, RouteMatch } from 'react-router-dom';

export {};

export interface AppRouteProps {
  path?: keyof typeof ROUTES;
  element?: React.FC;
}

export type CanActivateFn = (route: RouteItem) => true | React.ReactElement;

export interface RouteData {
  title?: string;
  acl?:
    | {
        control: Control | Control[];
        mode?: ControlMode;
      }
    | Control
    | Control[];
  canActivate?: CanActivateFn[];
  canActivateChild?: CanActivateFn[];
  cache?: string;
}

export interface IndexRouteItem extends IndexRouteObject {
  data?: RouteData;
}
export interface NonIndexRouteItem extends Omit<NonIndexRouteObject, 'children'> {
  children?: NonIndexRouteItem[];
  data?: RouteData;
}
export type RouteItem = IndexRouteItem | NonIndexRouteItem;

export interface IndexRouteItemInput extends IndexRouteObject {
  data?: RouteData | ((params: any) => RouteData);
}
export interface NonIndexRouteItemInput extends Omit<NonIndexRouteObject, 'children'> {
  children?: NonIndexRouteItemInput[];
  data?: RouteData | ((params: any) => RouteData);
}
export type RouteItemInput = IndexRouteItemInput | NonIndexRouteItemInput;

export interface RouteStateContextData {
  matchRoutes: RouteMatch<string, RouteItem>[] | null;
  title?: string;
}
