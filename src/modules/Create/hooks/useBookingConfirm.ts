import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { createBookings, submitBookingsFlight } from '@/api';
import { CLIENT_SOURCE, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { FLIGHT_ADD_ONS } from '@/constants/queryKey';
import { APPROVAL_PATH } from '@/constants/routePath';
import { BOOKING_PARAMS, USER } from '@/constants/storageKey';
import type {
  BookingFlightPayloadType,
  BookingParamsType,
  BookingPayloadType,
  FlightBookingAddOnsResponseType,
  FlightBookingAddOnType,
  PassengerGuestType,
  ResponseType,
  UserType,
} from '@/types';
import { localStorageGet } from '@/utils/localStorage';
import { sessionStorageGet, sessionStorageRemove } from '@/utils/sessionStorage';

export default function useFlightConfirm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createBookingsMutation = useMutation({
    mutationFn: (payload: BookingPayloadType) => createBookings(payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const submitBookingsFlightMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookingFlightPayloadType }) =>
      submitBookingsFlight(id, payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);
  const { flights = [], paxList = [], tripType } = bookingParams ?? {};

  const createBooking = async () => {
    const userProfile = localStorageGet<UserType>(USER);
    let startDate = '';
    let endDate = '';
    if (flights?.length) {
      startDate = flights?.[0]?.departureDate;
      endDate = flights?.[flights?.length - 1]?.departureDate;
    }
    // TODO: get start and end date from flights and hotel

    const bookingPayload: BookingPayloadType = {
      startDate: startDate,
      endDate: endDate,
      contactEmail: userProfile?.email ?? '',
      contactFirstName: userProfile?.firstName ?? '',
      contactLastName: userProfile?.lastName ?? '',
      contactTitle: userProfile?.gender === 'MALE' ? 'MR' : 'MRS',
      contactNationality: 'ID',
      contactPhoneCode: userProfile?.countryCode ?? '',
      contactPhoneNumber: userProfile?.phoneNo ?? '',
      contactDob: userProfile?.dateOfBirth
        ? dayjs(userProfile.dateOfBirth).format('YYYY-MM-DD')
        : '',
    };
    return await createBookingsMutation.mutateAsync(bookingPayload);
  };

  const createBookingsFlight = async (bookingId: string, values: any) => {
    const flightAddOns: FlightBookingAddOnType[] = [];
    const flightsPayload = flights?.map((flight) => {
      const departure = flight.selectedFlight?.journeys?.[0]?.departureDetail;
      const arrival = flight.selectedFlight?.journeys?.[0]?.arrivalDetail;
      const cachedFlightAddOns = queryClient.getQueryData<
        ResponseType<FlightBookingAddOnsResponseType>
      >([FLIGHT_ADD_ONS, flight.selectedFlight?.flightId]);
      flightAddOns.push(
        cachedFlightAddOns?.data?.journeysWithAvailableAddOnsOptions?.[0] as FlightBookingAddOnType,
      );
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
      };
    });
    const paxsPayload = paxList.map((pax: PassengerGuestType, paxIndex: number) => {
      const addOn: FlightBookingAddOnType[] = flightAddOns.map((flightAddOn, flightIndex) => {
        const paxAddOnValues =
          values?.flights?.[`flight-${flightIndex}`]?.paxs?.[`pax-${paxIndex}`] ?? {};

        const baggageId = paxAddOnValues?.baggage;
        const mealId = paxAddOnValues?.meal;

        return {
          ...flightAddOn,
          availableAddOnsOptions: {
            ...flightAddOn.availableAddOnsOptions,
            baggageOptions: baggageId
              ? (flightAddOn.availableAddOnsOptions.baggageOptions ?? []).filter(
                  (b) => b.id === baggageId,
                )
              : [],
            mealOptions: mealId
              ? (flightAddOn.availableAddOnsOptions.mealOptions ?? []).filter(
                  (m) => m.id === mealId,
                )
              : [],
          },
        };
      });
      return {
        firstName: pax.firstName,
        lastName: pax.lastName,
        title: pax.gender === 'MALE' ? 'MR' : 'MRS',
        gender: pax.gender,
        type: pax.type ?? 'ADULT',
        email: pax.email,
        nationality: 'ID',
        phoneCode: pax.phoneCode ?? '',
        phoneNumber: `${pax.phoneCode ?? ''}${pax.phoneNumber ?? ''}`,
        dob: pax.dob,
        addOn: addOn,
        issuingCountry: 'ID',
        documentType: 'PASSPORT',
        documentNo: pax.passportNumber,
        expirationDate: pax.passportExpiry,
      };
    });
    const bookingFlightPayload: BookingFlightPayloadType = {
      flights: flightsPayload,
      paxs: paxsPayload,
    };
    return await submitBookingsFlightMutation.mutateAsync({
      id: bookingId,
      payload: bookingFlightPayload,
    });
  };

  const handleSubmitForApproval = async (values: any) => {
    try {
      const createBookingsResponse = await createBooking();
      const bookingId = createBookingsResponse?.data?.id?.toString() ?? '';
      if (flights?.length) {
        await createBookingsFlight(bookingId, values);
      }
      // TODO: hotel booking
      message.success('Booking submitted for approval');
      sessionStorageRemove(BOOKING_PARAMS);

      navigate(APPROVAL_PATH);
    } catch (e: any) {
      console.error('e', e);
    }
  };

  return {
    bookingParams,
    handleSubmitForApproval,
    isLoading: createBookingsMutation.isPending || submitBookingsFlightMutation.isPending,
  };
}
