import type resources from '../../resources';
import type { Control, ControlMode } from '@laser-pro/acl/types';

import DashboardOutlined from '@material-design-icons/svg/outlined/dashboard.svg?react';
import ReportOutlined from '@material-design-icons/svg/outlined/report.svg?react';
import ScienceOutlined from '@material-design-icons/svg/outlined/science.svg?react';
import TableViewOutlined from '@material-design-icons/svg/outlined/table_view.svg?react';

import { ROUTES_ACL } from './acl';

export type TitleI18nKey = keyof (typeof resources)['en-US']['title'];

export interface AppMenuItem {
  path: string;
  type: 'item' | 'group' | 'sub';
  title?: string;
  titleI18n?: TitleI18nKey;
  icon?: React.FunctionComponent;
  greedyMatch?: boolean;
  disabled?: boolean;
  acl?:
    | {
        control: Control | Control[];
        mode?: ControlMode;
      }
    | Control
    | Control[];
  children?: AppMenuItem[];
}

export const MENU: AppMenuItem[] = [
  {
    path: '/dashboard',
    type: 'sub',
    titleI18n: 'dashboard',
    icon: DashboardOutlined,
    children: [
      {
        path: '/dashboard/echarts',
        type: 'item',
        titleI18n: 'eCharts',
        acl: ROUTES_ACL['/dashboard/echarts'],
      },
    ],
  },
  {
    path: '/list',
    type: 'sub',
    titleI18n: 'list',
    icon: TableViewOutlined,
    children: [
      {
        path: '/list/standard-table',
        type: 'item',
        titleI18n: 'standardTable',
        greedyMatch: true,
        acl: ROUTES_ACL['/list/standard-table'],
      },
    ],
  },
  {
    path: '/test',
    type: 'sub',
    titleI18n: 'test',
    icon: ScienceOutlined,
    children: [
      {
        path: '/test/acl',
        type: 'item',
        titleI18n: 'acl',
        acl: ROUTES_ACL['/test/acl'],
      },
      {
        path: '/test/http',
        type: 'item',
        titleI18n: 'http',
        acl: ROUTES_ACL['/test/http'],
      },
    ],
  },
  {
    path: '/exception',
    type: 'sub',
    titleI18n: 'exception',
    icon: ReportOutlined,
    children: [
      {
        path: '/exception/403',
        type: 'item',
        titleI18n: 'e403',
      },
      {
        path: '/exception/404',
        type: 'item',
        titleI18n: 'e404',
      },
      {
        path: '/exception/500',
        type: 'item',
        titleI18n: 'e500',
      },
    ],
  },
];
