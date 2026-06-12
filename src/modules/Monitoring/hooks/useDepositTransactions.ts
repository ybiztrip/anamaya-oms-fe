import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { exportDepositMonitoring, fetchDepositMonitoring } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { MONITORING_DEPOSIT_TRANSACTIONS } from '@/constants/queryKey';
import type { DepositCodeType, DepositMonitoringPayloadType } from '@/types';

export default function useDepositTransactions(
  code: DepositCodeType,
  filters?: {
    startDate?: string;
    endDate?: string;
    referenceCode?: string;
    booker?: string;
  },
) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const payload: DepositMonitoringPayloadType = useMemo(
    () => ({
      page: page - 1,
      size: pageSize,
      balanceCodeType: code,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      referenceCode: filters?.referenceCode,
      contactEmail: filters?.booker,
    }),
    [page, pageSize, code, filters?.startDate, filters?.endDate, filters?.referenceCode, filters?.booker],
  );

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [
      MONITORING_DEPOSIT_TRANSACTIONS,
      code,
      filters?.startDate,
      filters?.endDate,
      filters?.referenceCode,
      filters?.booker,
    ],
    queryFn: () => fetchDepositMonitoring(payload),
  });

  const exportMutation = useMutation({
    mutationFn: () => exportDepositMonitoring(payload),
  });

  const refreshDepositTransactions = () =>
    queryClient.invalidateQueries({ queryKey: [MONITORING_DEPOSIT_TRANSACTIONS, code] });

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    data,
    isLoading: isLoading || isFetching,
    error,
    exportDepositTransactions: exportMutation.mutateAsync,
    isExporting: exportMutation.isPending,
    refreshDepositTransactions,
  };
}
