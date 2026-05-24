import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { exportDepositMonitoring, fetchDepositMonitoring } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { MONITORING_DEPOSIT_TRANSACTIONS } from '@/constants/queryKey';
import type { DepositCodeType, DepositMonitoringPayloadType } from '@/types';

export default function useDepositTransactions(
  code: DepositCodeType,
  filters?: {
    createdAt?: string;
    referenceCode?: string;
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
      createdAt: filters?.createdAt,
      referenceCode: filters?.referenceCode,
    }),
    [page, pageSize, code, filters?.createdAt, filters?.referenceCode],
  );

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [MONITORING_DEPOSIT_TRANSACTIONS, code, filters?.createdAt, filters?.referenceCode],
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
