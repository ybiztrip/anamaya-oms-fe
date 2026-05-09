import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { createTravelPolicy, fetchTravelPolicies, updateTravelPolicy } from '@/api';
import { AIRLINE_CODE_GARUDA, DEFAULT_PAGE_SIZE } from '@/constants/common';
import { TRAVEL_POLICIES } from '@/constants/queryKey';
import type { TravelPolicyListPayloadType, TravelPolicyType } from '@/types';

export default function useTravelPolicy() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const payload: TravelPolicyListPayloadType = useMemo(
    () => ({
      page: page - 1,
      size: pageSize,
    }),
    [page, pageSize],
  );

  const buildTravelPolicyPayload = (values: any, existing?: TravelPolicyType): TravelPolicyType => {
    return {
      id: values.id ?? existing?.id ?? 0,
      status: values.status ?? existing?.status ?? 1,
      name: values.name,
      flights: [
        {
          name: AIRLINE_CODE_GARUDA,
          isActive: values.includingGarudaAirline,
        },
      ],
      flightMinimumPrice: values.flightMinimumPrice,
      flightMaximumPrice: values.flightMaximumPrice,
      flightMinimumClass: values.flightMinimumClass,
      flightMaximumClass: values.flightMaximumClass,
      hotelMinimumPrice: values.hotelMinimumPrice,
      hotelMaximumPrice: values.hotelMaximumPrice,
      hotelMinimumClass: values.hotelMinimumClass,
      hotelMaximumClass: values.hotelMaximumClass,
      hotelPagu: '',
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [TRAVEL_POLICIES, payload],
    queryFn: () => fetchTravelPolicies(payload),
  });

  const createMutation = useMutation({
    mutationFn: (values: TravelPolicyType) => createTravelPolicy(values),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: TravelPolicyType }) =>
      updateTravelPolicy(String(id), values),
  });

  const refreshTravelPolicies = () =>
    queryClient.invalidateQueries({ queryKey: [TRAVEL_POLICIES] });

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    data,
    isLoading,
    error,
    buildTravelPolicyPayload,
    createMutation,
    updateMutation,
    refreshTravelPolicies,
  };
}
