import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';

import { fetchBookings } from '@/api';
import { BOOKINGS_MY_REQUEST } from '@/constants/queryKey';
import { USER } from '@/constants/storageKey';
import type { BookingListPayloadType, UserType } from '@/types';
import { localStorageGet } from '@/utils/localStorage';

export default function useBookingMyRequest() {
  const userProfile = localStorageGet<UserType>(USER);

  const payload: BookingListPayloadType = {
    userId: String(userProfile?.id),
    needAttachment: false,
  };
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [BOOKINGS_MY_REQUEST],
    queryFn: () => fetchBookings(payload),
    select: (data) => {
      if (!data.success) {
        message.error(data.message);
      }
      return data;
    },
  });

  return {
    data: data?.data,
    isLoading: isLoading || isFetching,
    error,
  };
}
