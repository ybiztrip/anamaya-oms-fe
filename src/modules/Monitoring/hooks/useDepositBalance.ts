import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchDepositBalance } from '@/api';
import { MONITORING_DEPOSIT_BALANCE } from '@/constants/queryKey';

export default function useDepositBalance() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [MONITORING_DEPOSIT_BALANCE],
    queryFn: () => fetchDepositBalance(),
  });

  const refreshDepositBalance = () =>
    queryClient.invalidateQueries({ queryKey: [MONITORING_DEPOSIT_BALANCE] });

  return {
    data,
    isLoading,
    error,
    refreshDepositBalance,
  };
}
