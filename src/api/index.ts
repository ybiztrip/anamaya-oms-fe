import { FLIGHT_AIRPORTS_API, USERS_API } from '@/constants/api';
import type { AirportType, PaginationResponseType, ResponseType, UserType } from '@/types';
import axios from '@/utils/api';

export async function fetchUsers(): Promise<PaginationResponseType<UserType>> {
  const res = await axios.get(USERS_API);
  return res.data;
}

export async function fetchAirports(): Promise<ResponseType<AirportType[]>> {
  const res = await axios.get(FLIGHT_AIRPORTS_API);
  return res.data;
}
