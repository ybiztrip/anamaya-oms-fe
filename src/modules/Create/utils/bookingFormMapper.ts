import dayjs from 'dayjs';

import { ADULT_AGE, ADULT_TYPE, CHILD_AGE, CHILD_TYPE, INFANT_TYPE } from '@/constants/common';
import type { BookingParamsType, PassengerGuestType } from '@/types';

function paxFormToPaxParams(values: any): PassengerGuestType[] {
  return values.paxList.map((pax: any) => ({
    ...pax,
    dob: dayjs(pax.dob),
    passportExpiry: dayjs(pax.passportExpiry),
    type: pax.dob
      ? dayjs(pax.dob).isBefore(dayjs().subtract(ADULT_AGE, 'year'))
        ? ADULT_TYPE
        : dayjs(pax.dob).isBefore(dayjs().subtract(CHILD_AGE, 'year'))
          ? CHILD_TYPE
          : INFANT_TYPE
      : ADULT_TYPE,
  }));
}

function paxParamsToPaxForm(paxList: PassengerGuestType[]): any {
  return paxList.map((pax: PassengerGuestType) => ({
    ...pax,
    dob: pax.dob ? dayjs(pax.dob) : undefined,
    passportExpiry: pax.passportExpiry ? dayjs(pax.passportExpiry) : undefined,
  }));
}

export function flightFormToBookingParams(values: any): BookingParamsType {
  const paxList = paxFormToPaxParams(values);
  if (values.tripType === 'roundTrip') {
    return {
      ...values,
      paxList,
      flights: [
        {
          name: 'Departure',
          origin: values.origin,
          destination: values.destination,
          departureDate: values.departureDate,
          flightClass: values.flightClass,
        },
        {
          name: 'Return',
          origin: values.destination,
          destination: values.origin,
          departureDate: values.returnDate,
          flightClass: values.flightClass,
        },
      ],
    };
  } else if (values.tripType === 'oneWay') {
    return {
      ...values,
      paxList,
      flights: [
        {
          name: 'Departure',
          origin: values.origin,
          destination: values.destination,
          departureDate: values.departureDate,
          flightClass: values.flightClass,
        },
      ],
    };
  } else {
    return {
      ...values,
      paxList,
      flights: values.flights.map((flight: any, index: number) => ({
        name: `Flight ${index + 1}`,
        origin: flight.origin,
        destination: flight.destination,
        departureDate: flight.departureDate,
        returnDate: flight.returnDate,
        flightClass: values.flightClass,
      })),
    };
  }
}

export function bookingParamsToFlightForm(bookingParams: BookingParamsType): any {
  if (bookingParams.tripType !== 'multiCity') {
    const { flights, paxList, ...rest } = bookingParams;
    return {
      ...rest,
      origin: flights?.[0]?.origin,
      destination: flights?.[0]?.destination,
      flightClass: flights?.[0]?.flightClass,
      departureDate: dayjs(flights?.[0]?.departureDate),
      ...(bookingParams.tripType === 'roundTrip'
        ? { returnDate: dayjs(flights?.[1]?.departureDate) }
        : {}),
      paxList: paxParamsToPaxForm(paxList),
    };
  } else {
    const { flights, paxList, ...rest } = bookingParams;
    return {
      ...rest,
      flightClass: flights?.[0]?.flightClass,
      flights: flights?.map((flight: any) => ({
        ...flight,
        departureDate: dayjs(flight.departureDate),
      })),
      paxList: paxParamsToPaxForm(paxList),
    };
  }
}

export function hotelFormToBookingParams(values: any): BookingParamsType {
  const paxList = paxFormToPaxParams(values);
  return {
    ...values,
    paxList,
    hotel: {
      destination: values.destination,
      checkInDate: values.stayRange[0],
      checkOutDate: values.stayRange[1],
      hotelStars: values.hotelStars,
      rooms: values.rooms,
      notes: values.notes,
    },
  };
}

export function bookingParamsToHotelForm(bookingParams: BookingParamsType): any {
  const { hotel, paxList, ...rest } = bookingParams;
  return {
    ...rest,
    destination: hotel?.destination,
    stayRange: [dayjs(hotel?.checkInDate), dayjs(hotel?.checkOutDate)],
    hotelStars: hotel?.hotelStars,
    rooms: hotel?.rooms,
    notes: hotel?.notes,
    paxList: paxParamsToPaxForm(paxList),
  };
}
