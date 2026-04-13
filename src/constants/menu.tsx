import { CheckSquareOutlined, PlusOutlined } from '@ant-design/icons';
import type { ComponentType } from 'react';

import { APPROVAL_PATH, CREATE_PATH } from '@/constants/routePath';

export type MenuChild = {
  name: string;
  title: string;
  path: string;
  Icon?: ComponentType;
};

export type Menu = {
  name: string;
  title: string;
  path: string;
  childs: MenuChild[];
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
];
