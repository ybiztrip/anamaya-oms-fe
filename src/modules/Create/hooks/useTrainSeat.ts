import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';

import { getBookingsTrainSeat } from '@/api';
import { TRAIN_SEATS } from '@/constants/queryKey';

export default function useTrainSeat({
  bookingId,
  trainId,
}: {
  bookingId?: number;
  trainId?: number;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: [TRAIN_SEATS, bookingId, trainId] as const,
    queryFn: () =>
      getBookingsTrainSeat(String(bookingId), {
        trainId: Number(trainId),
      }),
    enabled: Boolean(bookingId) && Boolean(trainId),
    select: (response) => {
      if (!response.success) {
        message.error(response.message);
      }
      return response;
    },
  });

  return {
    data: data?.data,
    seatsMap: data?.data ?? [],
    isLoading,
    error,
  };
}
