import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchTravelPolicies } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { TRAVEL_POLICIES } from '@/constants/queryKey';

export default function useTravelPolicy() {
  const { data, isLoading, error } = useQuery({
    queryKey: [TRAVEL_POLICIES],
    queryFn: () =>
      fetchTravelPolicies({
        size: DEFAULT_PAGE_SIZE,
        page: 0,
      }),
  });

  const travelPoliciesById = useMemo(() => {
    const list = data?.data ?? [];
    return Object.fromEntries(list.map((r) => [r.id, r]));
  }, [data]);

  return {
    data,
    travelPoliciesById,
    isLoading: isLoading,
    error: error,
  };
}
