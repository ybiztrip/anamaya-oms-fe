import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchAirports } from '@/api';
import { FLIGHT_AIRPORTS } from '@/constants/queryKey';

export default function useFlightAirport() {
  const { data, isLoading, error } = useQuery({
    queryKey: [FLIGHT_AIRPORTS],
    queryFn: fetchAirports,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const airportsByCode = useMemo(() => {
    const list = data?.data ?? [];
    return Object.fromEntries(list.map((a) => [a.airportCode, a]));
  }, [data]);

  return {
    data,
    airportsByCode,
    isLoading: isLoading,
    error: error,
  };
}
