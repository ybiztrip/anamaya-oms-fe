import { useInfiniteQuery } from '@tanstack/react-query';
import { message } from 'antd';

import { fetchBookings } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { BOOKINGS_MY_REQUEST } from '@/constants/queryKey';
import { USER } from '@/constants/storageKey';
import type { BookingListPayloadType, BookingType, UserType } from '@/types';
import { localStorageGet } from '@/utils/localStorage';

export default function useBookingMyRequest() {
  const userProfile = localStorageGet<UserType>(USER);

  const basePayload: BookingListPayloadType = {
    size: DEFAULT_PAGE_SIZE,
    userId: String(userProfile?.id),
    needAttachment: false,
  };

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useInfiniteQuery({
      queryKey: [BOOKINGS_MY_REQUEST, basePayload],
      queryFn: async ({ pageParam = 0 }) => {
        const payload: BookingListPayloadType = {
          ...basePayload,
          page: pageParam,
        };
        const res = await fetchBookings(payload);
        if (!res.success) {
          message.error(res.message);
          throw new Error(res.message);
        }
        return res;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      initialPageParam: 0,
    });

  const items: BookingType[] = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    items,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  };
}
