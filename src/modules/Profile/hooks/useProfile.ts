import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';

import { fetchUserDetail, updateUser } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { USERS } from '@/constants/queryKey';
import { USER } from '@/constants/storageKey';
import type { UserType } from '@/types';
import dayjs from '@/utils/dayjs';
import { localStorageGet, localStorageSet } from '@/utils/localStorage';

export default function useProfile() {
  const currentUser = localStorageGet<UserType>(USER);

  const { data, isLoading, error } = useQuery({
    queryKey: [USERS, currentUser?.id],
    queryFn: () => fetchUserDetail(String(currentUser?.id)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UserType }) =>
      updateUser(String(id), payload),
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
        return;
      }
      localStorageSet<UserType>(USER, data.data);
      message.success('Profile updated');
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const submitUpdate = async (values: any) => {
    const phoneCode = values.phoneCode ?? '';
    const phoneNumber = values.phoneNumber ?? '';
    const phoneNo = `${phoneCode}${phoneNumber}`.trim();

    const payload: UserType = {
      id: Number(currentUser?.id),
      companyId: Number(currentUser?.companyId),
      status: currentUser?.status ?? 1,
      email: values.email ?? currentUser?.email ?? '',
      travelPolicyId: currentUser?.travelPolicyId ?? 0,
      firstName: values.firstName ?? currentUser?.firstName ?? '',
      lastName: values.lastName ?? currentUser?.lastName ?? '',
      title: values.title ?? currentUser?.title ?? '',
      gender: values.title === 'MR' ? 'MALE' : 'FEMALE',
      phoneNo: phoneNo || currentUser?.phoneNo || '',
      countryCode: phoneCode || currentUser?.countryCode || '',
      dateOfBirth: values.dob
        ? dayjs(values.dob).format('YYYY-MM-DD')
        : (currentUser?.dateOfBirth ?? ''),
      identityNo: values.idNumber ?? currentUser?.identityNo ?? '',
      passportNo: values.passportNumber ?? currentUser?.passportNo ?? '',
      passportExpiry: values.passportExpiry
        ? dayjs(values.passportExpiry).format('YYYY-MM-DD')
        : (currentUser?.passportExpiry ?? ''),
      nationality: 'ID',
      positionId: 2,
      updatedBy: Number(currentUser?.id),
    };
    await updateMutation.mutateAsync({ id: currentUser?.id ?? 0, payload: payload });
  };

  return {
    data,
    isLoading,
    error,
    submitUpdate,
  };
}
