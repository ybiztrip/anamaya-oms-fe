import type { AxiosRequestConfig } from 'axios';

import {
  BOOKINGS_API,
  BOOKINGS_APPROVE_API,
  BOOKINGS_ATTACHMENT_API,
  BOOKINGS_DETAIL_API,
  BOOKINGS_FLIGHT_API,
  BOOKINGS_HOTEL_API,
  BOOKINGS_MY_APPROVAL_API,
  BOOKINGS_NEED_APPROVAL_API,
  BOOKINGS_REJECT_API,
  DOCUMENT_UPLOAD_API,
  DOCUMENT_URL_API,
  FLIGHT_AIRLINES_API,
  FLIGHT_AIRPORTS_API,
  FLIGHT_BOOKING_ADD_ONS_API,
  FLIGHT_SEARCH_ONE_WAY_API,
  HOTEL_DISCOVERY_API,
  HOTEL_GEO_LIST_API,
  HOTEL_PROPERTY_DETAIL_API,
  HOTEL_ROOM_API,
  HOTEL_ROOM_RATE_API,
  ROLES_API,
  USERS_API,
  USERS_DETAIL_API,
  USERS_ROLES_API,
  USERS_UPDATE_PASSWORD_API,
} from '@/constants/api';
import type {
  AirlineType,
  AirportType,
  BookingApprovePayloadType,
  BookingAttachmentPayloadType,
  BookingAttachmentResponseType,
  BookingCreatePayloadType,
  BookingCreateResponseType,
  BookingDetailResponseType,
  BookingFlightPayloadType,
  BookingFlightResponseType,
  BookingHotelPayloadType,
  BookingHotelResponseType,
  BookingListPayloadType,
  BookingMyApprovalPayloadType,
  BookingNeedApprovalPayloadType,
  BookingRejectPayloadType,
  BookingType,
  FlightBookingAddOnsPayloadType,
  FlightBookingAddOnsResponseType,
  FlightSearchOneWayPayloadType,
  FlightSearchOneWayResponseType,
  HotelDiscoveryPayloadType,
  HotelDiscoveryResponseType,
  HotelGeoListPayloadType,
  HotelGeoListType,
  HotelPropertyDetailPayloadType,
  HotelPropertyDetailResponseType,
  HotelRoomPayloadType,
  HotelRoomRatePayloadType,
  HotelRoomRateResponseType,
  HotelRoomResponseType,
  PaginationResponseType,
  ResponseType,
  RoleType,
  UserListPayloadType,
  UserRolesUpsertPayloadType,
  UserRoleType,
  UserType,
  UserUpdatePasswordPayloadType,
} from '@/types';
import axios from '@/utils/api';

export async function fetchRoles(): Promise<ResponseType<RoleType[]>> {
  const res = await axios.get(ROLES_API);
  return res.data;
}

export async function fetchUsers(
  params: UserListPayloadType,
): Promise<PaginationResponseType<UserType>> {
  const res = await axios.get(USERS_API, { params });
  return res.data;
}

export async function fetchUserDetail(id: string): Promise<ResponseType<UserType>> {
  const res = await axios.get(USERS_DETAIL_API.replace(':id', id));
  return res.data;
}

export async function createUser(params: UserType): Promise<ResponseType<UserType>> {
  const res = await axios.post(USERS_API, params);
  return res.data;
}

export async function updateUser(id: string, params: UserType): Promise<ResponseType<UserType>> {
  const res = await axios.put(USERS_DETAIL_API.replace(':id', id), params);
  return res.data;
}

export async function fetchUserRoles(id: string): Promise<ResponseType<UserRoleType[]>> {
  const res = await axios.get(USERS_ROLES_API.replace(':id', id));
  return res.data;
}

export async function upsertUserRoles(
  id: string,
  params: UserRolesUpsertPayloadType,
): Promise<ResponseType<any>> {
  const res = await axios.post(USERS_ROLES_API.replace(':id', id), params);
  return res.data;
}

export async function updateUserPassword(
  id: string,
  params: UserUpdatePasswordPayloadType,
): Promise<ResponseType<any>> {
  const res = await axios.put(USERS_UPDATE_PASSWORD_API.replace(':id', id), params);
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

export async function fetchHotelPropertyDetail(
  params: HotelPropertyDetailPayloadType,
): Promise<ResponseType<HotelPropertyDetailResponseType>> {
  const res = await axios.post(HOTEL_PROPERTY_DETAIL_API, params);
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
): Promise<PaginationResponseType<BookingType>> {
  const res = await axios.get(BOOKINGS_API, { params });
  return res.data;
}

export async function fetchBookingDetail(
  id: string,
): Promise<ResponseType<BookingDetailResponseType>> {
  const res = await axios.get(BOOKINGS_DETAIL_API.replace(':id', id));
  return res.data;
}

export async function fetchBookingsMyApproval(
  params: BookingMyApprovalPayloadType,
): Promise<PaginationResponseType<BookingType>> {
  const res = await axios.get(BOOKINGS_MY_APPROVAL_API, { params });
  return res.data;
}

export async function fetchBookingsNeedApproval(
  params: BookingNeedApprovalPayloadType,
): Promise<PaginationResponseType<BookingType>> {
  const res = await axios.get(BOOKINGS_NEED_APPROVAL_API, { params });
  return res.data;
}

export async function approveBookings(
  id: string,
  params: BookingApprovePayloadType,
): Promise<ResponseType<any>> {
  const res = await axios.put(BOOKINGS_APPROVE_API.replace(':id', id), params);
  return res.data;
}

export async function rejectBookings(
  id: string,
  params: BookingRejectPayloadType,
): Promise<ResponseType<any>> {
  const res = await axios.put(BOOKINGS_REJECT_API.replace(':id', id), params);
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

export async function submitBookingsAttachment(
  id: string,
  params: BookingAttachmentPayloadType,
): Promise<ResponseType<BookingAttachmentResponseType>> {
  const res = await axios.post(BOOKINGS_ATTACHMENT_API.replace(':id', id), params);
  return res.data;
}

export async function documentUpload(
  params: FormData,
  config: AxiosRequestConfig<FormData>,
): Promise<ResponseType<any>> {
  const res = await axios.post(DOCUMENT_UPLOAD_API, params, config);
  return res.data;
}

export async function documentUrl(key: string): Promise<ResponseType<string>> {
  const res = await axios.get(DOCUMENT_URL_API, { params: { key } });
  return res.data;
}
