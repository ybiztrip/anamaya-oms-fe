import { PERMISSIONS_BY_ROLE } from '@/constants/permission';
import { USER } from '@/constants/storageKey';
import type { UserType } from '@/types';
import { localStorageGet } from '@/utils/localStorage';

export function getUserPermissions(): string[] {
  const user = localStorageGet<UserType>(USER) ?? undefined;
  const roleCodes = user?.roles?.map((r) => r.roleCode) ?? [];
  const permissions = roleCodes.flatMap((code) => PERMISSIONS_BY_ROLE[code] ?? []);
  return Array.from(new Set(permissions));
}

export function isPermitted(permission: string) {
  return getUserPermissions().includes(permission);
}

export function isPermittedAny(permissions: string[]) {
  if (permissions.length === 0) return true;
  const userPerms = getUserPermissions();
  return permissions.some((p) => userPerms.includes(p));
}

export function isPermittedAll(permissions: string[]) {
  if (permissions.length === 0) return true;
  const userPerms = getUserPermissions();
  return permissions.every((p) => userPerms.includes(p));
}
