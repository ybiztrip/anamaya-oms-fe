import {
  CheckSquareOutlined,
  ControlOutlined,
  LineChartOutlined,
  PlusOutlined,
  SettingOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ComponentType } from 'react';

import {
  APPROVAL_PATH,
  CONFIGURATION_COMPANY_PATH,
  CONFIGURATION_EMPLOYEES_PATH,
  CONFIGURATION_TRAVEL_POLICIES_PATH,
  CREATE_PATH,
  // MONITORING_CREDIT_PATH,
  MONITORING_DEPOSIT_PATH,
} from '@/constants/routePath';

import { PERMISSIONS } from './permission';

export type MenuChild = {
  name: string;
  title: string;
  path: string;
  permissions?: string[];
  Icon?: ComponentType;
};

export type Menu = {
  name: string;
  title: string;
  path: string;
  childs: MenuChild[];
  permissions?: string[];
  Icon?: ComponentType;
};

export const menus: Menu[] = [
  {
    name: 'create',
    title: 'Create',
    path: CREATE_PATH,
    childs: [],
    Icon: PlusOutlined,
  },
  {
    name: 'approval',
    title: 'Approval',
    path: APPROVAL_PATH,
    childs: [],
    Icon: CheckSquareOutlined,
  },
  {
    name: 'configuration',
    title: 'Configuration',
    path: '',
    permissions: [PERMISSIONS.CONFIG_EMPLOYEE, PERMISSIONS.CONFIG_COMPANY],
    childs: [
      {
        name: 'employees',
        title: 'Employees',
        path: CONFIGURATION_EMPLOYEES_PATH,
        permissions: [PERMISSIONS.CONFIG_EMPLOYEE],
        Icon: UserOutlined,
      },
      {
        name: 'travel-policies',
        title: 'Travel Policies',
        path: CONFIGURATION_TRAVEL_POLICIES_PATH,
        permissions: [PERMISSIONS.CONFIG_TRAVEL_POLICY],
        Icon: SolutionOutlined,
      },
      {
        name: 'company',
        title: 'Company',
        path: CONFIGURATION_COMPANY_PATH,
        permissions: [PERMISSIONS.CONFIG_COMPANY],
        Icon: ControlOutlined,
      },
    ],
    Icon: SettingOutlined,
  },
  {
    name: 'monitoring-deposit',
    title: 'Monitoring Deposit',
    path: MONITORING_DEPOSIT_PATH,
    childs: [],
    permissions: [PERMISSIONS.MONITORING_DEPOSIT],
    Icon: LineChartOutlined,
  },
  // {
  //   name: 'monitoring-credit',
  //   title: 'Monitoring Credit',
  //   path: MONITORING_CREDIT_PATH,
  //   childs: [],
  //   permissions: [PERMISSIONS.MONITORING_CREDIT],
  //   Icon: LineChartOutlined,
  // },
];
