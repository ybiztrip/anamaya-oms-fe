import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

import { fetchHotelRoom } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { HotelRoomPayloadType } from '@/types';

export default function useHotelRoom({ propertyId }: { propertyId: string }) {
  const { mutateAsync, data, isPending, error, reset } = useMutation({
    mutationFn: (payload: HotelRoomPayloadType) => fetchHotelRoom(payload),
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
      }
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const getHotelRooms = async () => {
    const payload: HotelRoomPayloadType = {
      propertyId: propertyId,
    };
    await mutateAsync(payload);
  };

  return {
    data: data,
    isLoading: isPending,
    error: error,
    reset: reset,
    getHotelRooms,
  };
}
