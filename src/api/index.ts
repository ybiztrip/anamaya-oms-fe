import {
  FLIGHT_AIRLINES_API,
  FLIGHT_AIRPORTS_API,
  FLIGHT_SEARCH_ONE_WAY_API,
  USERS_API,
} from '@/constants/api';
import type {
  AirlineType,
  AirportType,
  FlightSearchOneWayPayloadType,
  FlightSearchOneWayResponseType,
  PaginationResponseType,
  ResponseType,
  UserType,
} from '@/types';
import axios from '@/utils/api';

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
  const res = await axios.post(FLIGHT_SEARCH_ONE_WAY_API, params);
  return res.data;
}
