import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { useMemo } from 'react';

import { fetchBookings } from '@/api';
import { BOOKINGS } from '@/constants/queryKey';
import type { BookingListPayloadType } from '@/types';

export default function useBookingList({ status, userId }: { status?: string; userId?: string }) {
  const payload: BookingListPayloadType = useMemo(() => ({ status, userId }), [status, userId]);
  const { data, isLoading, error } = useQuery({
    queryKey: [BOOKINGS, status, userId],
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
    isLoading,
    error,
  };
}
