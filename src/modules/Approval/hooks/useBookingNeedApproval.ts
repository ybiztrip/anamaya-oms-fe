import { useInfiniteQuery } from '@tanstack/react-query';
import { message } from 'antd';

import { fetchBookingsNeedApproval } from '@/api';
import { BOOKINGS_NEED_APPROVAL } from '@/constants/queryKey';
import type { BookingNeedApprovalPayloadType, BookingType } from '@/types';

export default function useBookingNeedApproval() {
  const basePayload: BookingNeedApprovalPayloadType = {
    size: 10,
    needAttachment: false,
  };

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useInfiniteQuery({
      queryKey: [BOOKINGS_NEED_APPROVAL, basePayload],
      queryFn: async ({ pageParam = 0 }) => {
        const payload: BookingNeedApprovalPayloadType = {
          ...basePayload,
          page: pageParam,
        };
        const res = await fetchBookingsNeedApproval(payload);
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
