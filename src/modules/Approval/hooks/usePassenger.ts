import { useQuery } from '@tanstack/react-query';

import { fetchPassengers } from '@/api';
import { USERS } from '@/constants/queryKey';
import type { PassengerType } from '@/types';

export type usePassengerProps = {
  isLoading: boolean;
  passengers: PassengerType[];
  error: Error | null;
  refetch: () => void;
};

const usePassenger = (): usePassengerProps => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [USERS],
    queryFn: fetchPassengers,
  });

  return {
    passengers: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
};

export default usePassenger;
