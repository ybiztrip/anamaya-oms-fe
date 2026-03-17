import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';

import { fetchHotelDiscovery } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { BookingHotelParamsType, BookingParamsType, HotelDiscoveryPayloadType } from '@/types';

export default function useHotelSearch({ bookingParams }: { bookingParams: BookingParamsType }) {
  const hotelParams = bookingParams?.hotel as BookingHotelParamsType;
  const { mutateAsync, data, isPending, error, reset } = useMutation({
    mutationFn: (payload: HotelDiscoveryPayloadType) => fetchHotelDiscovery(payload),
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
      }
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const handleSearchHotels = async (values: any) => {
    const payload: HotelDiscoveryPayloadType = {
      geoId: values.destination?.value ?? '',
      checkInDate: dayjs(values.checkInDate).format('YYYY-MM-DD'),
      checkOutDate: dayjs(values.checkOutDate).format('YYYY-MM-DD'),
      cursor: '',
      numRooms: hotelParams?.rooms,
      displayCurrency: 'IDR',
      sortBy: values.sortBy ?? 'HIGHEST_PRICE',
      filters: {
        priceRange: {
          max: values.maxPrice ?? 0,
          min: values.minPrice ?? 0,
        },
        starRating: [
          hotelParams.hotelStars.includes('1') ? true : false,
          hotelParams.hotelStars.includes('2') ? true : false,
          hotelParams.hotelStars.includes('3') ? true : false,
          hotelParams.hotelStars.includes('4') ? true : false,
          hotelParams.hotelStars.includes('5') ? true : false,
        ],
      },
      page: values.page ?? 1,
      limit: values.limit ?? 10,
    };
    await mutateAsync(payload);
  };

  return {
    hotelParams,
    data: data,
    isLoading: isPending,
    error: error,
    reset: reset,
    handleSearchHotels,
  };
}
