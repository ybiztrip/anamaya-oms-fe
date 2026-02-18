import dayjs from 'dayjs';

import type { BookingParamsType } from '@/types';

export function flightFormToBookingParams(values: any): BookingParamsType {
  if (values.tripType === 'roundTrip') {
    return {
      ...values,
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
    const { flights, ...rest } = bookingParams;
    return {
      ...rest,
      origin: flights?.[0]?.origin,
      destination: flights?.[0]?.destination,
      flightClass: flights?.[0]?.flightClass,
      departureDate: dayjs(flights?.[0]?.departureDate),
      ...(bookingParams.tripType === 'roundTrip'
        ? { returnDate: dayjs(flights?.[1]?.departureDate) }
        : {}),
    };
  } else {
    return {
      ...bookingParams,
      flightClass: bookingParams.flights?.[0]?.flightClass,
      flights: bookingParams.flights?.map((flight: any) => ({
        ...flight,
        departureDate: dayjs(flight.departureDate),
      })),
    };
  }
}
