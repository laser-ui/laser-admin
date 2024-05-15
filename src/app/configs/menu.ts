import type { Control, ControlMode } from '@laser-ui/admin/packages/acl/acl';

import DashboardOutlined from '@material-design-icons/svg/outlined/dashboard.svg?react';
import ReportOutlined from '@material-design-icons/svg/outlined/report.svg?react';
import ScienceOutlined from '@material-design-icons/svg/outlined/science.svg?react';
import TableViewOutlined from '@material-design-icons/svg/outlined/table_view.svg?react';

import { ROUTES_ACL } from './acl';

export interface AppMenuItem {
  path: string;
  type: 'item' | 'group' | 'sub';
  title?: string;
  titleI18n?: string;
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
    titleI18n: 'Dashboard',
    icon: DashboardOutlined,
    children: [
      {
        path: '/dashboard/echarts',
        type: 'item',
        titleI18n: 'ECharts',
        acl: ROUTES_ACL['/dashboard/echarts'],
      },
    ],
  },
  {
    path: '/list',
    type: 'sub',
    titleI18n: 'List',
    icon: TableViewOutlined,
    children: [
      {
        path: '/list/standard-table',
        type: 'item',
        titleI18n: 'Standard Table',
        greedyMatch: true,
        acl: ROUTES_ACL['/list/standard-table'],
      },
    ],
  },
  {
    path: '/test',
    type: 'sub',
    titleI18n: 'Test',
    icon: ScienceOutlined,
    children: [
      {
        path: '/test/acl',
        type: 'item',
        titleI18n: 'ACL',
        acl: ROUTES_ACL['/test/acl'],
      },
      {
        path: '/test/http',
        type: 'item',
        titleI18n: 'Http',
        acl: ROUTES_ACL['/test/http'],
      },
    ],
  },
  {
    path: '/exception',
    type: 'sub',
    titleI18n: 'Exception',
    icon: ReportOutlined,
    children: [
      {
        path: '/exception/403',
        type: 'item',
        titleI18n: '403',
      },
      {
        path: '/exception/404',
        type: 'item',
        titleI18n: '404',
      },
      {
        path: '/exception/500',
        type: 'item',
        titleI18n: '500',
      },
    ],
  },
];
