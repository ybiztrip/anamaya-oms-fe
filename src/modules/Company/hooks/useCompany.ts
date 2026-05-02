import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';

import { fetchCompanyConfigs, updateCompanyConfigs } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { COMPANY_CONFIGS } from '@/constants/queryKey';
import type { CompanyConfigsUpdatePayloadType } from '@/types';

export default function useCompany() {
  const { data, isLoading, error } = useQuery({
    queryKey: [COMPANY_CONFIGS],
    queryFn: () => fetchCompanyConfigs(),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CompanyConfigsUpdatePayloadType) => updateCompanyConfigs(payload),
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
        return;
      }
      message.success('Company configs updated');
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const submitUpdate = async (code: string, value: boolean) => {
    const payload: CompanyConfigsUpdatePayloadType = {
      items: [{ code, valueBool: value }],
    };
    await updateMutation.mutateAsync(payload);
  };

  return {
    data,
    isLoading,
    error,
    submitUpdate,
  };
}
