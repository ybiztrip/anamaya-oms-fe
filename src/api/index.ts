import {
  BOOKINGS_API,
  BOOKINGS_FLIGHT_API,
  FLIGHT_AIRLINES_API,
  FLIGHT_AIRPORTS_API,
  FLIGHT_BOOKING_ADD_ONS_API,
  FLIGHT_SEARCH_ONE_WAY_API,
  HOTEL_DISCOVERY_API,
  HOTEL_GEO_LIST_API,
  USERS_API,
  USERS_DETAIL_API,
} from '@/constants/api';
import type {
  AirlineType,
  AirportType,
  BookingFlightPayloadType,
  BookingFlightResponseType,
  BookingPayloadType,
  BookingResponseType,
  FlightBookingAddOnsPayloadType,
  FlightBookingAddOnsResponseType,
  FlightSearchOneWayPayloadType,
  FlightSearchOneWayResponseType,
  HotelDiscoveryPayloadType,
  HotelDiscoveryResponseType,
  HotelGeoListPayloadType,
  HotelGeoListType,
  PaginationResponseType,
  ResponseType,
  UserType,
} from '@/types';
import axios from '@/utils/api';

export async function fetchUsers(): Promise<PaginationResponseType<UserType>> {
  const res = await axios.get(USERS_API);
  return res.data;
}

export async function fetchUserDetail(id: string): Promise<ResponseType<UserType>> {
  const res = await axios.get(USERS_DETAIL_API.replace(':id', id));
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
  const res = await axios.post(FLIGHT_SEARCH_ONE_WAY_API, params);
  return res.data;
}

export async function fetchFlightBookingAddOns(
  params: FlightBookingAddOnsPayloadType,
): Promise<ResponseType<FlightBookingAddOnsResponseType>> {
  const res = await axios.post(FLIGHT_BOOKING_ADD_ONS_API, params);
  return res.data;
}

export async function fetchHotelGeoList(
  params: HotelGeoListPayloadType,
): Promise<ResponseType<HotelGeoListType>> {
  const res = await axios.post(HOTEL_GEO_LIST_API, params);
  return res.data;
}

export async function fetchHotelDiscovery(
  params: HotelDiscoveryPayloadType,
): Promise<ResponseType<HotelDiscoveryResponseType>> {
  const res = await axios.post(HOTEL_DISCOVERY_API, params);
  return res.data;
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
