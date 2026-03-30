import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';

import { fetchHotelRoomRate } from '@/api';
import { ADULT_TYPE, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { BookingParamsType, HotelRoomRatePayloadType, PassengerGuestType } from '@/types';

export default function useHotelRoomRate({
  propertyId,
  bookingParams,
}: {
  propertyId: string;
  bookingParams: BookingParamsType;
}) {
  const { mutateAsync, data, isPending, error, reset } = useMutation({
    mutationFn: (payload: HotelRoomRatePayloadType) => fetchHotelRoomRate(payload),
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
      }
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const getHotelRoomRates = async () => {
    const { hotel, paxList } = bookingParams;

    let totalAdult = 0;
    paxList?.forEach((pax: PassengerGuestType) => {
      if (pax?.type === ADULT_TYPE) {
        totalAdult++;
      }
    });

    const payload: HotelRoomRatePayloadType = {
      checkInDate: dayjs(hotel?.checkInDate).format('YYYY-MM-DD'),
      checkOutDate: dayjs(hotel?.checkOutDate).format('YYYY-MM-DD'),
      language: 'en',
      userNationality: 'ID',
      numRooms: hotel?.rooms ?? 0,
      numAdults: totalAdult,
      displayCurrency: 'IDR',
      isExtended: true,
      propertyId: propertyId,
    };
    await mutateAsync(payload);
  };

  return {
    data: data,
    isLoading: isPending,
    error: error,
    reset: reset,
    getHotelRoomRates,
  };
}
