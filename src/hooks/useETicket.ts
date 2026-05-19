import { useMutation } from '@tanstack/react-query';

import { fetchBookingETicket } from '@/api';
import type { BookingETicketPayloadType } from '@/types';

export default function useETicket() {
  const mutation = useMutation({
    mutationFn: (payload: BookingETicketPayloadType) => fetchBookingETicket(payload),
  });

  return {
    downloadETicket: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
