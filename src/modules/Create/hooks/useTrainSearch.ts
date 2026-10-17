import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';

import { fetchTrainAvailability } from '@/api';
import { ADULT_TYPE, DEFAULT_ERROR_MESSAGE, INFANT_TYPE } from '@/constants/common';
import type { BookingParamsType, PassengerGuestType, TrainAvailabilityPayloadType } from '@/types';

export default function useTrainSearch({
  trainIndex,
  bookingParams,
}: {
  trainIndex: number;
  bookingParams: BookingParamsType;
}) {
  const trainParams = bookingParams?.trains?.[trainIndex];
  const { mutateAsync, data, isPending, error, reset } = useMutation({
    mutationFn: (payload: TrainAvailabilityPayloadType) => fetchTrainAvailability(payload),
    onSuccess: (data) => {
      if (!data.success) {
        message.error(data.message);
      }
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const handleSearchTrains = async (values: any) => {
    let totalAdult = 0;
    let totalInfant = 0;
    bookingParams?.paxList?.forEach((pax: PassengerGuestType) => {
      if (pax?.type === ADULT_TYPE) {
        totalAdult++;
      } else if (pax?.type === INFANT_TYPE) {
        totalInfant++;
      }
    });
    const payload: TrainAvailabilityPayloadType = {
      route: {
        origin: values.origin,
        destination: values.destination,
        departDate: dayjs(values.departureDate).format('YYYY-MM-DD'),
      },
      adult: totalAdult,
      infant: totalInfant,
      class: values?.trainClass ?? 0,
    };
    await mutateAsync(payload);
  };

  return {
    trainParams,
    searchTrain: mutateAsync,
    data: data,
    isLoading: isPending,
    error: error,
    reset: reset,
    handleSearchTrains,
  };
}
