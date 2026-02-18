import {
  BOOKINGS_API,
  BOOKINGS_FLIGHT_API,
  FLIGHT_AIRLINES_API,
  FLIGHT_AIRPORTS_API,
  FLIGHT_SEARCH_ONE_WAY_API,
  USERS_API,
} from '@/constants/api';
import type {
  AirlineType,
  AirportType,
  BookingFlightPayloadType,
  BookingFlightResponseType,
  BookingPayloadType,
  BookingResponseType,
  FlightSearchOneWayPayloadType,
  FlightSearchOneWayResponseType,
  PaginationResponseType,
  ResponseType,
  UserType,
} from '@/types';
import axios from '@/utils/api';

import { mockFetchFlightSearchOneWay } from './mock';

export async function fetchUsers(): Promise<PaginationResponseType<UserType>> {
  const res = await axios.get(USERS_API);
  return res.data;
}

export async function fetchAirports(): Promise<ResponseType<AirportType[]>> {
  const res = await axios.get(FLIGHT_AIRPORTS_API);
  return res.data;
}

export async function fetchAirlines(): Promise<ResponseType<AirlineType[]>> {
  const res = await axios.get(FLIGHT_AIRLINES_API);
  return res.data;
}

export async function fetchFlightSearchOneWay(
  params: FlightSearchOneWayPayloadType,
): Promise<ResponseType<FlightSearchOneWayResponseType>> {
  // const res = await axios.post(FLIGHT_SEARCH_ONE_WAY_API, params);
  // return res.data;
  return mockFetchFlightSearchOneWay;
}

export async function createBookings(
  params: BookingPayloadType,
): Promise<ResponseType<BookingResponseType>> {
  const res = await axios.post(BOOKINGS_API, params);
  return res.data;
}

export async function submitBookingsFlight(
  id: string,
  params: BookingFlightPayloadType,
): Promise<ResponseType<BookingFlightResponseType>> {
  const res = await axios.post(BOOKINGS_FLIGHT_API.replace(':id', id), params);
  return res.data;
}
