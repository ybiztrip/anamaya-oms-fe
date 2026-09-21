import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchTrainStations } from '@/api';
import { TRAIN_STATIONS } from '@/constants/queryKey';

export default function useTrainStation() {
  const { data, isLoading, error } = useQuery({
    queryKey: [TRAIN_STATIONS],
    queryFn: fetchTrainStations,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const stationsByCode = useMemo(() => {
    const list = data?.data ?? [];
    return Object.fromEntries(list.map((a) => [a.stationCode, a]));
  }, [data]);

  return {
    data,
    stationsByCode,
    isLoading: isLoading,
    error: error,
  };
}
