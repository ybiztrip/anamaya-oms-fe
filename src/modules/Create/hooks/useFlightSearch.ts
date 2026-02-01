import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';

import { fetchFlightSearchOneWay } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { FLIGHT_SEARCH_PARAMS } from '@/constants/storageKey';
import type {
  FlightSearchOneWayPayloadType,
  FlightSearchOneWayType,
  FlightSearchParamsType,
} from '@/types';
import { sessionStorageGet, sessionStorageSet } from '@/utils/sessionStorage';

export default function useFlightSearch() {
  const { mutateAsync, data, isPending, error, reset } = useMutation({
    mutationFn: (payload: FlightSearchOneWayPayloadType) => fetchFlightSearchOneWay(payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const flightSearchParams = sessionStorageGet<FlightSearchParamsType>(FLIGHT_SEARCH_PARAMS);

  const handleSearchFlights = async (values: any) => {
    const payload: FlightSearchOneWayPayloadType = {
      journey: {
        depAirportOrAreaCode: values.origin,
        arrAirportOrAreaCode: values.destination,
        depDate: dayjs(values.departureDate).format('DD-MM-YYYY'),
        seatClass: flightSearchParams?.flightClass ?? 'ECONOMY',
        sortBy: values.sortBy ?? 'ARRIVAL_TIME',
      },
      passengers: {
        adult: String(flightSearchParams?.paxList?.length ?? 1),
        child: '0', // TODO: add child count
        infant: '0', // TODO: add infant count
      },
    };
    await mutateAsync(payload);

    const currentFlightSearchParams =
      sessionStorageGet<FlightSearchParamsType>(FLIGHT_SEARCH_PARAMS) ?? flightSearchParams;

    sessionStorageSet<FlightSearchParamsType>(FLIGHT_SEARCH_PARAMS, {
      ...currentFlightSearchParams,
      origin: values.origin,
      destination: values.destination,
      departureDate: values.departureDate,
      ...(currentFlightSearchParams?.tripType === 'roundTrip'
        ? { returnDate: values.returnDate }
        : {}),
    } as FlightSearchParamsType);
  };

  const handleSelectFlight = (flight: FlightSearchOneWayType) => {
    const currentFlightSearchParams =
      sessionStorageGet<FlightSearchParamsType>(FLIGHT_SEARCH_PARAMS) ?? flightSearchParams;
    sessionStorageSet<FlightSearchParamsType>(FLIGHT_SEARCH_PARAMS, {
      ...currentFlightSearchParams,
      selectedFlight: flight,
    } as FlightSearchParamsType);
  };

  return {
    searchFlight: mutateAsync,
    data: data,
    isLoading: isPending,
    error: error,
    reset: reset,
    flightSearchParams,
    handleSearchFlights,
    handleSelectFlight,
  };
}
