import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message, type UploadFile } from 'antd';
import dayjs from 'dayjs';
import { useCallback } from 'react';

import { submitBookingsFlight } from '@/api';
import { CLIENT_SOURCE, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { FLIGHT_ADD_ONS } from '@/constants/queryKey';
import { USER } from '@/constants/storageKey';
import type {
  BookingFlightPayloadType,
  BookingParamsType,
  BookingPriceItemType,
  FlightBookingAddOnsResponseType,
  FlightBookingAddOnType,
  PassengerGuestType,
  ResponseType,
  UserType,
} from '@/types';
import { localStorageGet } from '@/utils/localStorage';

import { getBookingPaxPayload } from '../utils/bookingPaxMapper';
import {
  buildAvailableAddOnsFlights,
  buildPaxWithSelectedAddOnPayload,
} from '../utils/flightAddOnMapper';

export default function useBookingFlight() {
  const queryClient = useQueryClient();

  const submitBookingsFlightMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookingFlightPayloadType }) =>
      submitBookingsFlight(id, payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const submitFlight = useCallback(
    async ({
      bookingId,
      bookingParams,
      values,
      flightPrices,
    }: {
      bookingId: string;
      bookingParams: BookingParamsType;
      values: any;
      flightPrices?: Record<number, BookingPriceItemType[]>;
    }) => {
      const userProfile = localStorageGet<UserType>(USER);
      const {
        flights = [],
        paxList = [],
        tripType,
        attachments = [],
      } = bookingParams;

      const flightsPayload = flights.map((flight, flightIndex: number) => {
        const departure = flight.selectedFlight?.journeys?.[0]?.departureDetail;
        const arrival = flight.selectedFlight?.journeys?.at(-1)?.arrivalDetail;
        const allSegments = flight.selectedFlight?.journeys.flatMap((j) => j?.segments ?? []);
        return {
          type: tripType === 'roundTrip' ? 1 : tripType === 'oneWay' ? 2 : 3,
          clientSource: CLIENT_SOURCE,
          itemId: flight.selectedFlight?.flightId ?? '',
          origin: flight.selectedFlight?.departureAirport ?? '',
          destination: flight.selectedFlight?.arrivalAirport ?? '',
          departureDatetime: departure?.departureDate
            ? dayjs(
                `${departure.departureDate}T${departure.departureTime}:00`,
                'MM-DD-YYYY HH:mm',
              ).format('YYYY-MM-DDTHH:mm:ss')
            : '',
          arrivalDatetime: arrival?.arrivalDate
            ? dayjs(`${arrival.arrivalDate}T${arrival.arrivalTime}:00`, 'MM-DD-YYYY HH:mm').format(
                'YYYY-MM-DDTHH:mm:ss',
              )
            : '',
          // TODO: payment
          paymentMethod: 'DEPOSIT',
          paymentReference1: '',
          paymentReference2: '',
          metadata: {
            prices: flightPrices?.[flightIndex] ?? [],
            booker: userProfile?.email,
            departureAirport: flight.selectedFlight?.departureAirport ?? '',
            departureTerminal: departure?.departureTerminal ?? '',
            arrivalAirport: flight.selectedFlight?.arrivalAirport ?? '',
            arrivalTerminal: arrival?.arrivalTerminal ?? '',
            airlines: allSegments?.map((segment) => segment?.marketingAirline),
            flightCodes: allSegments?.map((segment) => segment?.flightCode),
            passengerNames: paxList.map(
              (pax: PassengerGuestType) => `${pax.firstName} ${pax.lastName}`,
            ),
            attachments: attachments?.map((attachment: UploadFile) => ({
              name: attachment.name ?? '',
              file: attachment.response ?? '',
            })),
          },
        };
      });

      const paxsPayload = paxList.map((pax: PassengerGuestType, paxIndex: number) => {
        const addOn: FlightBookingAddOnType[] = flights.flatMap((flight, flightIndex) => {
          const selectedFlight = flight.selectedFlight;
          if (!selectedFlight) {
            return [];
          }
          const cachedFlightAddOns = queryClient.getQueryData<
            ResponseType<FlightBookingAddOnsResponseType>
          >([FLIGHT_ADD_ONS, selectedFlight.flightId]);
          const templates = buildAvailableAddOnsFlights(
            selectedFlight,
            cachedFlightAddOns?.data?.journeysWithAvailableAddOnsOptions,
          );
          return templates.map((template, slotIndex) =>
            buildPaxWithSelectedAddOnPayload(template, values, flightIndex, slotIndex, paxIndex),
          );
        });
        return {
          ...getBookingPaxPayload(pax),
          addOn,
        };
      });

      return submitBookingsFlightMutation.mutateAsync({
        id: bookingId,
        payload: {
          flights: flightsPayload,
          paxs: paxsPayload,
        },
      });
    },
    [queryClient, submitBookingsFlightMutation],
  );

  return {
    submitFlight,
    isLoading: submitBookingsFlightMutation.isPending,
  };
}
