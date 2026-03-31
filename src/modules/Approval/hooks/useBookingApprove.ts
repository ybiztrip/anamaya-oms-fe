import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { approveBookings, rejectBookings } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { BOOKINGS_MY_APPROVAL, BOOKINGS_NEED_APPROVAL } from '@/constants/queryKey';
import type { BookingApprovePayloadType, BookingRejectPayloadType } from '@/types';

export default function useBookingApprove() {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookingApprovePayloadType }) =>
      approveBookings(id, payload),
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
        return;
      }
      message.success('Booking approved');
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_NEED_APPROVAL] });
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_MY_APPROVAL] });
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookingRejectPayloadType }) =>
      rejectBookings(id, payload),
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
        return;
      }
      message.success('Booking rejected');
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_NEED_APPROVAL] });
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_MY_APPROVAL] });
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  return {
    approveBooking: approveMutation.mutateAsync,
    rejectBooking: rejectMutation.mutateAsync,
    isLoading: approveMutation.isPending || rejectMutation.isPending,
  };
}
