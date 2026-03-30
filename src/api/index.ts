import {
  BOOKINGS_API,
  BOOKINGS_FLIGHT_API,
  BOOKINGS_HOTEL_API,
  FLIGHT_AIRLINES_API,
  FLIGHT_AIRPORTS_API,
  FLIGHT_BOOKING_ADD_ONS_API,
  FLIGHT_SEARCH_ONE_WAY_API,
  HOTEL_DISCOVERY_API,
  HOTEL_GEO_LIST_API,
  HOTEL_ROOM_API,
  HOTEL_ROOM_RATE_API,
  USERS_API,
  USERS_DETAIL_API,
} from '@/constants/api';
import type {
  AirlineType,
  AirportType,
  BookingCreatePayloadType,
  BookingCreateResponseType,
  BookingFlightPayloadType,
  BookingFlightResponseType,
  BookingHotelPayloadType,
  BookingHotelResponseType,
  BookingListPayloadType,
  BookingListResponseType,
  FlightBookingAddOnsPayloadType,
  FlightBookingAddOnsResponseType,
  FlightSearchOneWayPayloadType,
  FlightSearchOneWayResponseType,
  HotelDiscoveryPayloadType,
  HotelDiscoveryResponseType,
  HotelGeoListPayloadType,
  HotelGeoListType,
  HotelRoomPayloadType,
  HotelRoomRatePayloadType,
  HotelRoomRateResponseType,
  HotelRoomResponseType,
  PaginationResponseType,
  ResponseType,
  UsersPayloadType,
  UserType,
} from '@/types';
import axios from '@/utils/api';

export async function fetchUsers(
  params: UsersPayloadType,
): Promise<PaginationResponseType<UserType>> {
  const res = await axios.get(USERS_API, { params });
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

export async function fetchHotelRoom(
  params: HotelRoomPayloadType,
): Promise<ResponseType<HotelRoomResponseType>> {
  const res = await axios.post(HOTEL_ROOM_API, params);
  return res.data;
}

export async function fetchHotelRoomRate(
  params: HotelRoomRatePayloadType,
): Promise<ResponseType<HotelRoomRateResponseType>> {
  const res = await axios.post(HOTEL_ROOM_RATE_API, params);
  return res.data;
}

export async function fetchBookings(
  params: BookingListPayloadType,
): Promise<ResponseType<BookingListResponseType>> {
  const res = await axios.get(BOOKINGS_API, { params });
  return res.data;
}

export async function createBookings(
  params: BookingCreatePayloadType,
): Promise<ResponseType<BookingCreateResponseType>> {
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

export async function submitBookingsHotel(
  id: string,
  params: BookingHotelPayloadType,
): Promise<ResponseType<BookingHotelResponseType>> {
  const res = await axios.post(BOOKINGS_HOTEL_API.replace(':id', id), params);
  return res.data;
}
