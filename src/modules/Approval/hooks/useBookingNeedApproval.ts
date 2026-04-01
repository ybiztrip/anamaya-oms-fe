import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';

import { fetchBookingsNeedApproval } from '@/api';
import { BOOKING_STATUS_BOOKED } from '@/constants/common';
import { BOOKINGS_NEED_APPROVAL } from '@/constants/queryKey';
import type { BookingNeedApprovalPayloadType } from '@/types';

export default function useBookingNeedApproval() {
  const payload: BookingNeedApprovalPayloadType = {
    size: 10,
    needAttachment: false,
  };
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [BOOKINGS_NEED_APPROVAL],
    queryFn: () => fetchBookingsNeedApproval(payload),
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
