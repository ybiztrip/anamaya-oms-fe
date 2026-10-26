import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useCallback } from 'react';

import { createBookings } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { USER } from '@/constants/storageKey';
import type { BookingCreatePayloadType, BookingParamsType, UserType } from '@/types';
import dayjs from '@/utils/dayjs';
import { localStorageGet } from '@/utils/localStorage';

export default function useBooking() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: BookingCreatePayloadType) => createBookings(payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const createBooking = useCallback(
    async (bookingParams: BookingParamsType) => {
      const userProfile = localStorageGet<UserType>(USER);
      const { flights = [], hotel, trains = [] } = bookingParams;

      let startDate = '';
      let endDate = '';
      if (flights.length) {
        startDate = flights[0]?.departureDate ?? '';
        endDate = flights[flights.length - 1]?.departureDate ?? '';
      }
      if (hotel) {
        startDate = hotel.checkInDate ?? '';
        endDate = hotel.checkOutDate ?? '';
      }
      if (trains.length) {
        startDate = trains[0]?.departureDate ?? '';
        endDate = trains[trains.length - 1]?.departureDate ?? '';
      }

      return mutateAsync({
        startDate,
        endDate,
        contactEmail: userProfile?.email ?? '',
        contactFirstName: userProfile?.firstName ?? '',
        contactLastName: userProfile?.lastName ?? '',
        contactTitle: userProfile?.title ?? 'MR',
        contactNationality: 'ID',
        contactPhoneCode: userProfile?.countryCode ?? '',
        contactPhoneNumber: userProfile?.phoneNo ?? '',
        contactDob: userProfile?.dateOfBirth
          ? dayjs(userProfile.dateOfBirth).format('YYYY-MM-DD')
          : '',
      });
    },
    [mutateAsync],
  );

  return {
    createBooking,
    isLoading: isPending,
  };
}
