import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

import { fetchHotelPropertyDetail } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { HotelPropertyDetailPayloadType } from '@/types';

export default function useHotelPropertyDetail({ propertyId }: { propertyId: string }) {
  const { mutateAsync, data, isPending, error, reset } = useMutation({
    mutationFn: (payload: HotelPropertyDetailPayloadType) => fetchHotelPropertyDetail(payload),
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
      }
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const getHotelPropertyDetails = async () => {
    const payload: HotelPropertyDetailPayloadType = {
      propertyIds: [propertyId],
    };
    await mutateAsync(payload);
  };

  return {
    data: data,
    isLoading: isPending,
    error: error,
    reset: reset,
    getHotelPropertyDetails,
  };
}
