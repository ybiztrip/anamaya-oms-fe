import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { useMemo } from 'react';

import { fetchFlightBookingAddOns } from '@/api';
import { FLIGHT_ADD_ONS } from '@/constants/queryKey';
import type { FlightBookingAddOnsPayloadType } from '@/types';

export default function useFlightAddOns({ flightId }: { flightId: string }) {
  const payload: FlightBookingAddOnsPayloadType = useMemo(
    () => ({
      journeyType: 'ONE_WAY',
      flightIds: [flightId],
    }),
    [flightId],
  );
  const { data, isLoading, error } = useQuery({
    queryKey: [FLIGHT_ADD_ONS, flightId],
    queryFn: () => fetchFlightBookingAddOns(payload),
    enabled: !!flightId,
    select: (data) => {
      if (!data.success) {
        message.error(data.message);
      }
      return data;
    },
  });

  const getBaggageById = (id: string) => {
    return data?.data?.journeysWithAvailableAddOnsOptions?.[0]?.availableAddOnsOptions?.baggageOptions?.find?.(
      (baggage: any) => baggage?.id === id,
    );
  };

  const getMealById = (id: string) => {
    return data?.data?.journeysWithAvailableAddOnsOptions?.[0]?.availableAddOnsOptions?.mealOptions?.find?.(
      (meal: any) => meal?.id === id,
    );
  };

  return {
    data: data?.data?.journeysWithAvailableAddOnsOptions[0],
    isLoading,
    error,
    getBaggageById,
    getMealById,
  };
}
