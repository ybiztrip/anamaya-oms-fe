import { ROLE_APPROVER, ROLE_COMPANY_ADMIN, ROLE_USER } from './common';

export const PERMISSIONS = {
  APPROVAL: 'approval',
  CONFIG_EMPLOYEE: 'config_employee',
  CONFIG_COMPANY: 'config_company',
};

export const PERMISSIONS_BY_ROLE: Record<string, string[]> = {
  [ROLE_COMPANY_ADMIN]: [PERMISSIONS.CONFIG_EMPLOYEE, PERMISSIONS.CONFIG_COMPANY],
  [ROLE_USER]: [],
  [ROLE_APPROVER]: [PERMISSIONS.APPROVAL],
};
