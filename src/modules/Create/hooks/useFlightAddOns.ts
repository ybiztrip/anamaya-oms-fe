import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { useMemo } from 'react';

import { fetchFlightBookingAddOns } from '@/api';
import { FLIGHT_ADD_ONS } from '@/constants/queryKey';
import type { FlightAddOnsType, FlightBookingAddOnsPayloadType } from '@/types';

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

  const getBaggageById = (id: string, addOns?: FlightAddOnsType) => {
    if (!addOns) {
      return null;
    }
    return addOns?.baggageOptions?.find?.(
      (baggage: any) => baggage?.id === id,
    );
  };

  const getMealById = (id: string, addOns?: FlightAddOnsType) => {
    if (!addOns) {
      return null;
    }
    return addOns?.mealOptions?.find?.(
      (meal: any) => meal?.id === id,
    );
  };

  return {
    data: data?.data,
    isLoading,
    error,
    getBaggageById,
    getMealById,
  };
}
