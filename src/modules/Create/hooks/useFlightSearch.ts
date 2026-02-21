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
    let totalAdult = 0; // age 12 and over
    let totalChild = 0; // age 2 - 11
    let totalInfant = 0; // below age 2
    bookingParams?.paxList?.forEach((pax) => {
      if (pax.dob) {
        if (dayjs(pax.dob).isBefore(dayjs().subtract(12, 'year'))) {
          totalAdult++;
        } else if (dayjs(pax.dob).isBefore(dayjs().subtract(2, 'year'))) {
          totalChild++;
        } else {
          totalInfant++;
        }
      } else {
        totalAdult++;
      }
    });
    const payload: FlightSearchOneWayPayloadType = {
      journey: {
        depAirportOrAreaCode: values.origin,
        arrAirportOrAreaCode: values.destination,
        depDate: dayjs(values.departureDate).format('MM-DD-YYYY'),
        seatClass: flightParams?.flightClass ?? 'ECONOMY',
        sortBy: values.sortBy ?? 'ARRIVAL_TIME',
      },
      passengers: {
        adult: String(totalAdult),
        child: String(totalChild),
        infant: String(totalInfant),
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
