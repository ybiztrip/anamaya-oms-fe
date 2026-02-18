import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';

import { fetchFlightSearchOneWay } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { BookingParamsType, FlightSearchOneWayPayloadType } from '@/types';

export default function useFlightSearch({
  flightIndex,
  bookingParams,
}: {
  flightIndex: number;
  bookingParams: BookingParamsType;
}) {
  const flightParams = bookingParams?.flights?.[flightIndex];
  const { mutateAsync, data, isPending, error, reset } = useMutation({
    mutationFn: (payload: FlightSearchOneWayPayloadType) => fetchFlightSearchOneWay(payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const handleSearchFlights = async (values: any) => {
    const payload: FlightSearchOneWayPayloadType = {
      journey: {
        depAirportOrAreaCode: values.origin,
        arrAirportOrAreaCode: values.destination,
        depDate: dayjs(values.departureDate).format('DD-MM-YYYY'),
        seatClass: flightParams?.flightClass ?? 'ECONOMY',
        sortBy: values.sortBy ?? 'ARRIVAL_TIME',
      },
      passengers: {
        adult: String(bookingParams?.paxList?.length ?? 1),
        child: '0', // TODO: add child count
        infant: '0', // TODO: add infant count
      },
    };
    await mutateAsync(payload);
    // TODO: filter and sort response data
  };

  return {
    flightParams,
    searchFlight: mutateAsync,
    data: data,
    isLoading: isPending,
    error: error,
    reset: reset,
    handleSearchFlights,
  };
}
