import { useMutation } from '@tanstack/react-query';
import { message, type UploadFile } from 'antd';
import dayjs from 'dayjs';
import { useCallback } from 'react';

import { submitBookingsHotel } from '@/api';
import { CLIENT_SOURCE, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { USER } from '@/constants/storageKey';
import type {
  BookingHotelPayloadType,
  BookingParamsType,
  BookingPriceItemType,
  PassengerGuestType,
  UserType,
} from '@/types';
import { localStorageGet } from '@/utils/localStorage';

import { getBookingPaxPayload } from '../utils/bookingPaxMapper';

export default function useBookingHotel() {
  const submitBookingsHotelMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookingHotelPayloadType }) =>
      submitBookingsHotel(id, payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const submitHotel = useCallback(
    async ({
      bookingId,
      bookingParams,
      values,
      hotelPrices,
    }: {
      bookingId: string;
      bookingParams: BookingParamsType;
      values: any;
      hotelPrices?: BookingPriceItemType[];
    }) => {
      const userProfile = localStorageGet<UserType>(USER);
      const { hotel, paxList = [], attachments = [] } = bookingParams;

      const hotelPayload = {
        clientSource: CLIENT_SOURCE,
        itemId: hotel?.selectedHotel?.propertyId ?? '',
        roomId: hotel?.selectedRoom?.roomId ?? '',
        rateKey: hotel?.selectedRoom?.rateKey ?? '',
        numRoom: hotel?.rooms ?? 1,
        checkInDate: hotel?.checkInDate ? dayjs(hotel.checkInDate).format('YYYY-MM-DD') : '',
        checkOutDate: hotel?.checkOutDate ? dayjs(hotel.checkOutDate).format('YYYY-MM-DD') : '',
        partnerSellAmount: hotel?.selectedRoom?.totalRates.partnerSellAmount ?? 0,
        partnerNettAmount: hotel?.selectedRoom?.totalRates.partnerNettAmount ?? 0,
        currency: hotel?.selectedRoom?.totalRates.partnerCurrency ?? '',
        specialRequest: values?.specialRequests ?? '',
        // TODO: payment
        paymentMethod: 'DEPOSIT',
        paymentReference1: '',
        paymentReference2: '',
        metadata: {
          prices: hotelPrices ?? [],
          booker: userProfile?.email,
          hotelName: hotel?.selectedHotel?.propertySummary?.name ?? '',
          hotelAddress: hotel?.selectedHotel?.propertySummary?.address?.lines?.join(', ') ?? '',
          hotelCity: hotel?.selectedHotel?.propertySummary?.address?.city ?? '',
          hotelStarRating: hotel?.selectedHotel?.propertySummary?.starRating ?? '',
          hotelRoomName: hotel?.selectedRoom?.roomName ?? '',
          guestNames: paxList.map((pax: PassengerGuestType) => `${pax.firstName} ${pax.lastName}`),
          attachments: attachments?.map((attachment: UploadFile) => ({
            name: attachment.name ?? '',
            file: attachment.response ?? '',
          })),
        },
      };

      return submitBookingsHotelMutation.mutateAsync({
        id: bookingId,
        payload: {
          hotel: hotelPayload,
          paxs: paxList.map((pax) => getBookingPaxPayload(pax)),
        },
      });
    },
    [submitBookingsHotelMutation],
  );

  return {
    submitHotel,
    isLoading: submitBookingsHotelMutation.isPending,
  };
}
