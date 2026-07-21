import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';

import { fetchFlightSearchOneWay } from '@/api';
import { ADULT_TYPE, CHILD_TYPE, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { BookingParamsType, FlightSearchOneWayPayloadType, PassengerGuestType } from '@/types';

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
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
      }
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const handleSearchFlights = async (values: any) => {
    let totalAdult = 0;
    let totalChild = 0;
    let totalInfant = 0;
    bookingParams?.paxList?.forEach((pax: PassengerGuestType) => {
      if (pax?.type === ADULT_TYPE) {
        totalAdult++;
      } else if (pax?.type === CHILD_TYPE) {
        totalChild++;
      } else {
        totalInfant++;
      }
    });
    const payload: FlightSearchOneWayPayloadType = {
      journey: {
        depAirportOrAreaCode: values.origin,
        arrAirportOrAreaCode: values.destination,
        depDate: dayjs(values.departureDate).format('MM-DD-YYYY'),
        seatClass: values?.flightClass ?? 'ECONOMY',
        sortBy: values.sortBy ?? 'ARRIVAL_TIME',
      },
      passengers: {
        adult: String(totalAdult),
        child: String(totalChild),
        infant: String(totalInfant),
      },
    };
    await mutateAsync(payload);
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
