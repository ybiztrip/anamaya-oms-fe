import { USERS_API } from '@/constants/api';
import type { PaginationResponseType, PassengerType } from '@/types';
import axios from '@/utils/api';

export async function fetchPassengers(): Promise<PaginationResponseType<PassengerType>> {
  const res = await axios.get(USERS_API);
  return res.data;
}
