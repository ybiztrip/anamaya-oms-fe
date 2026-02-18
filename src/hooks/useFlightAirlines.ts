import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchAirlines } from '@/api';
import { FLIGHT_AIRLINES } from '@/constants/queryKey';

export default function useFlightAirlines() {
  const { data, isLoading, error } = useQuery({
    queryKey: [FLIGHT_AIRLINES],
    queryFn: fetchAirlines,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const airlinesByCode = useMemo(() => {
    const list = data?.data ?? [];
    return Object.fromEntries(list.map((a) => [a.airlineCode, a]));
  }, [data]);

  return {
    airlinesByCode: airlinesByCode,
    isLoading: isLoading,
    error: error,
  };
}
