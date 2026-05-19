import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { fetchDepositMonitoring } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { MONITORING_DEPOSIT_TRANSACTIONS } from '@/constants/queryKey';
import type { DepositCodeType, DepositMonitoringPayloadType } from '@/types';

export default function useDepositTransactions(code: DepositCodeType) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const payload: DepositMonitoringPayloadType = useMemo(
    () => ({
      page: page - 1,
      size: pageSize,
      balanceCodeType: code,
    }),
    [page, pageSize, code],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: [MONITORING_DEPOSIT_TRANSACTIONS, code],
    queryFn: () => fetchDepositMonitoring(payload),
  });

  const refreshDepositTransactions = () =>
    queryClient.invalidateQueries({ queryKey: [MONITORING_DEPOSIT_TRANSACTIONS, code] });

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    data,
    isLoading,
    error,
    refreshDepositTransactions,
  };
}
