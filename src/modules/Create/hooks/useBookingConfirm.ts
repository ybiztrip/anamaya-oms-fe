import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { createBookings, submitBookingsFlight, submitBookingsHotel } from '@/api';
import { CLIENT_SOURCE, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { FLIGHT_ADD_ONS } from '@/constants/queryKey';
import { APPROVAL_PATH } from '@/constants/routePath';
import { BOOKING_PARAMS, USER } from '@/constants/storageKey';
import type {
  BookingCreatePayloadType,
  BookingFlightPayloadType,
  BookingHotelPayloadType,
  BookingParamsType,
  FlightBookingAddOnsResponseType,
  FlightBookingAddOnType,
  PassengerGuestType,
  ResponseType,
  UserType,
} from '@/types';
import { localStorageGet } from '@/utils/localStorage';
import { sessionStorageGet, sessionStorageRemove } from '@/utils/sessionStorage';

export default function useBookingConfirm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createBookingsMutation = useMutation({
    mutationFn: (payload: BookingCreatePayloadType) => createBookings(payload),
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

  const submitBookingsHotelMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookingHotelPayloadType }) =>
      submitBookingsHotel(id, payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);
  const { flights = [], paxList = [], tripType, hotel } = bookingParams ?? {};

  const createBooking = async () => {
    const userProfile = localStorageGet<UserType>(USER);
    let startDate = '';
    let endDate = '';
    if (flights?.length) {
      startDate = flights?.[0]?.departureDate;
      endDate = flights?.[flights?.length - 1]?.departureDate;
    } else if (hotel) {
      startDate = hotel?.checkInDate;
      endDate = hotel?.checkOutDate;
    }

    const bookingPayload: BookingCreatePayloadType = {
      startDate: startDate,
      endDate: endDate,
      contactEmail: userProfile?.email ?? '',
      contactFirstName: userProfile?.firstName ?? '',
      contactLastName: userProfile?.lastName ?? '',
      contactTitle: userProfile?.title ?? 'MR',
      contactNationality: 'ID',
      contactPhoneCode: userProfile?.countryCode ?? '',
      contactPhoneNumber: userProfile?.phoneNo ?? '',
      contactDob: userProfile?.dateOfBirth
        ? dayjs(userProfile.dateOfBirth).format('YYYY-MM-DD')
        : '',
    };
    return await createBookingsMutation.mutateAsync(bookingPayload);
  };

  const getBookingPaxPayload = (pax: PassengerGuestType) => {
    return {
      firstName: pax.firstName,
      lastName: pax.lastName,
      title: pax.title ?? 'MR',
      gender: pax.title === 'MR' ? 'MALE' : 'FEMALE',
      type: pax.type ?? 'ADULT',
      email: pax.email,
      nationality: 'ID',
      phoneCode: pax.phoneCode ?? '',
      phoneNumber: `${pax.phoneCode ?? ''}${pax.phoneNumber ?? ''}`,
      dob: pax.dob,
      issuingCountry: 'ID',
      documentType: 'PASSPORT',
      documentNo: pax.passportNumber,
      expirationDate: pax.passportExpiry,
    };
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
        // TODO: payment
        paymentMethod: 'DEPOSIT',
        paymentReference1: '',
        paymentReference2: '',
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
        ...getBookingPaxPayload(pax),
        addOn: addOn,
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

  const createBookingsHotel = async (bookingId: string, values: any) => {
    const hotelPayload = {
      clientSource: CLIENT_SOURCE,
      itemId: hotel?.selectedHotel?.propertyId ?? '',
      roomId: hotel?.selectedRoom?.roomId ?? '',
      rateKey: hotel?.selectedRoom?.rateKey ?? '',
      numRoom: hotel?.rooms ?? 1,
      checkInDate: hotel?.checkInDate ? dayjs(hotel.checkInDate).format('YYYY-MM-DD') : '',
      checkOutDate: hotel?.checkOutDate ? dayjs(hotel.checkOutDate).format('YYYY-MM-DD') : '',
      partnerSellAmount: hotel?.selectedRoom?.totalRates.partnerSellAmount ?? 0,
      partnerNettAmount: hotel?.selectedRoom?.totalRates.partnerNettAmount ?? 0,
      currency: hotel?.selectedRoom?.totalRates.partnerCurrency ?? '',
      specialRequest: values?.specialRequests ?? '',
      // TODO: payment
      paymentMethod: 'DEPOSIT',
      paymentReference1: '',
      paymentReference2: '',
    };
    const paxsPayload = paxList.map((pax: PassengerGuestType) => {
      return getBookingPaxPayload(pax);
    });
    const bookingHotelPayload: BookingHotelPayloadType = {
      hotel: hotelPayload,
      paxs: paxsPayload,
    };
    return await submitBookingsHotelMutation.mutateAsync({
      id: bookingId,
      payload: bookingHotelPayload,
    });
  };

  const handleSubmitForApproval = async (values: any) => {
    try {
      const createBookingsResponse = await createBooking();
      const bookingId = createBookingsResponse?.data?.id?.toString() ?? '';
      if (flights?.length) {
        await createBookingsFlight(bookingId, values);
      }
      if (hotel) {
        await createBookingsHotel(bookingId, values);
      }
      message.success('Booking submitted for approval');
      sessionStorageRemove(BOOKING_PARAMS);

      navigate(`${APPROVAL_PATH}?tab=my-request`);
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
