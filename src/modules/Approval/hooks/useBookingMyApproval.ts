import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';

import { fetchBookingsMyApproval } from '@/api';
import { BOOKING_STATUS_BOOKED } from '@/constants/common';
import { BOOKINGS_MY_APPROVAL } from '@/constants/queryKey';
import type { BookingMyApprovalPayloadType } from '@/types';

export default function useBookingMyApproval() {
  const payload: BookingMyApprovalPayloadType = {
    size: 10,
    needAttachment: false,
  };
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [BOOKINGS_MY_APPROVAL],
    queryFn: () => fetchBookingsMyApproval(payload),
    select: (data) => {
      if (!data.success) {
        message.error(data.message);
      }
      return data.data.map((x) => ({
        ...x,
        status: BOOKING_STATUS_BOOKED,
      }));
    },
  });

  return {
    data,
    isLoading: isLoading || isFetching,
    error,
  };
}
