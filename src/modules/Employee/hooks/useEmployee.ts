import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { createUser, fetchUserDetail, fetchUsers, updateUser, upsertUserRoles } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { USERS } from '@/constants/queryKey';
import { USER } from '@/constants/storageKey';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import type { UserListPayloadType, UserRolesUpsertPayloadType, UserType } from '@/types';
import dayjs from '@/utils/dayjs';
import { localStorageGet } from '@/utils/localStorage';

export default function useEmployee() {
  const queryClient = useQueryClient();

  const currentUser = localStorageGet<UserType>(USER);
  const [emailInput, setEmailInput] = useState('');
  const debouncedEmail = useDebouncedValue(emailInput, 400);
  const email = debouncedEmail.trim().toLowerCase();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const payload: UserListPayloadType = useMemo(
    () => ({
      page: page - 1,
      size: pageSize,
      email,
      includeRoles: true,
    }),
    [page, pageSize, email],
  );

  const buildUserPayload = (values: any, existing?: UserType): UserType => {
    const phoneCode = values.phoneCode ?? '';
    const phoneNumber = values.phoneNumber ?? '';
    const phoneNo = `${phoneCode}${phoneNumber}`.trim();
    return {
      id: values.id ?? existing?.id ?? 0,
      companyId: existing?.companyId ?? currentUser?.companyId ?? 0,
      status: values.status ?? existing?.status ?? 1,
      email: values.email ?? existing?.email ?? '',
      travelPolicyId: values.travelPolicy ?? existing?.travelPolicyId ?? 0,
      firstName: values.firstName ?? existing?.firstName ?? '',
      lastName: values.lastName ?? existing?.lastName ?? '',
      title: values.title ?? existing?.title ?? '',
      gender: values.title === 'MR' ? 'MALE' : 'FEMALE',
      phoneNo: phoneNo || existing?.phoneNo || '',
      countryCode: phoneCode || existing?.countryCode || '',
      dateOfBirth: values.dob
        ? dayjs(values.dob).format('YYYY-MM-DD')
        : (existing?.dateOfBirth ?? ''),
      identityNo: values.idNumber ?? existing?.identityNo ?? '',
      passportNo: values.passportNumber ?? existing?.passportNo ?? '',
      passportExpiry: values.passportExpiry
        ? dayjs(values.passportExpiry).format('YYYY-MM-DD')
        : (existing?.passportExpiry ?? ''),
      nationality: 'ID',
      positionId: 2,
      createdBy: existing ? existing.createdBy : (currentUser?.id ?? 0),
      updatedBy: currentUser?.id ?? 0,
      ...(values.password ? { password: values.password } : {}),
      enableChatEngine: false,
    };
  };

  const buildRolesPayload = (values: number[], existing?: UserType): UserRolesUpsertPayloadType => {
    const existingRoles = existing?.roles ?? [];
    const newRoles = values.filter((roleId) => !existingRoles.some((r) => r.roleId === roleId));
    const deletedRoles = existingRoles.filter((r) => !values.includes(r.roleId));
    return [
      ...newRoles.map((roleId) => ({
        roleId,
        isDelete: false,
      })),
      ...deletedRoles.map((r) => ({
        roleId: r.roleId,
        isDelete: true,
      })),
    ];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [USERS, payload],
    queryFn: () => fetchUsers(payload),
  });

  const createMutation = useMutation({
    mutationFn: (values: UserType) => createUser(values),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: UserType }) =>
      updateUser(String(id), values),
  });

  const detailMutation = useMutation({
    mutationFn: (id: number) => fetchUserDetail(String(id)),
  });

  const rolesMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: UserRolesUpsertPayloadType }) =>
      upsertUserRoles(String(id), values),
  });

  const refreshEmployees = () => queryClient.invalidateQueries({ queryKey: [USERS] });

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    setEmailInput,
    data,
    isLoading,
    error,
    buildUserPayload,
    buildRolesPayload,
    createMutation,
    detailMutation,
    updateMutation,
    rolesMutation,
    refreshEmployees,
  };
}
