import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';
import { parsePhoneNumber } from 'libphonenumber-js';

import { createBookings, submitBookingsFlight } from '@/api';
import { CLIENT_SOURCE, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { BOOKING_PARAMS, USER } from '@/constants/storageKey';
import type {
  BookingFlightPayloadType,
  BookingParamsType,
  BookingPayloadType,
  PassengerType,
  UserType,
} from '@/types';
import { localStorageGet } from '@/utils/localStorage';
import { sessionStorageGet } from '@/utils/sessionStorage';

export default function useFlightConfirm() {
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

  const handleSubmitForApproval = async (values: any) => {
    const userProfile = localStorageGet<UserType>(USER);
    let startDate = '';
    let endDate = '';
    if (flights?.length) {
      startDate = flights?.[0]?.departureDate;
      endDate = flights?.[flights?.length - 1]?.departureDate;
    }
    // TODO: get start and end date from flights and hotel

    const phone = parsePhoneNumber(userProfile?.phoneNo ?? '');
    
    // TODO: booking payload
    const bookingPayload: BookingPayloadType = {
      startDate: startDate,
      endDate: endDate,
      contactEmail: userProfile?.email ?? '',
      contactFirstName: userProfile?.firstName ?? '',
      contactLastName: userProfile?.lastName ?? '',
      contactTitle: 'MR',
      contactNationality: 'ID',
      contactPhoneCode: phone?.countryCallingCode ?? '',
      contactPhoneNumber: phone?.nationalNumber ?? '',
      contactDob: userProfile?.dateOfBirth
        ? dayjs(userProfile.dateOfBirth).format('YYYY-MM-DD')
        : '',
    };
    const createBookingsResponse = await createBookingsMutation.mutateAsync(bookingPayload);

    if (flights?.length) {
      const flightsPayload = flights?.map((flight) => {
        const departure = flight.selectedFlight?.journeys?.[0]?.departureDetail;
        const arrival = flight.selectedFlight?.journeys?.[0]?.arrivalDetail;
        return {
          type: tripType === 'roundTrip' ? 1 : tripType === 'oneWay' ? 2 : 3,
          clientSource: CLIENT_SOURCE,
          itemId: flight.selectedFlight?.flightId ?? '',
          origin: flight.selectedFlight?.departureAirport ?? '',
          destination: flight.selectedFlight?.arrivalAirport ?? '',
          departureDatetime: departure?.departureDate
            ? dayjs(
                `${departure.departureDate}T${departure.departureTime}:00`,
                'DD-MM-YYYY HH:mm',
              ).format('YYYY-MM-DDTHH:mm:ss')
            : '',
          arrivalDatetime: arrival?.arrivalDate
            ? dayjs(`${arrival.arrivalDate}T${arrival.arrivalTime}:00`, 'DD-MM-YYYY HH:mm').format(
                'YYYY-MM-DDTHH:mm:ss',
              )
            : '',
        };
      });
      const paxsPayload = paxList.map((pax: PassengerType) => {
        const phone = parsePhoneNumber(pax.phone);
        return {
          firstName: pax.firstName,
          lastName: pax.lastName,
          title: 'MR',
          gender: pax.gender,
          type: 'ADULT',
          email: pax.email,
          nationality: 'ID',
          phoneCode: phone?.countryCallingCode ?? '',
          phoneNumber: phone?.nationalNumber ?? '',
          dob: pax.dob,
          addOn: [], // TODO: add on
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
      // TODO: submit bookings flight payload
      await submitBookingsFlightMutation.mutateAsync({
        id: createBookingsResponse.data.id.toString(),
        payload: bookingFlightPayload,
      });
    }
    // TODO: hotel booking
  };

  return {
    bookingParams,
    handleSubmitForApproval,
  };
}
