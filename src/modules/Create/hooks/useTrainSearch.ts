import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';

import { fetchTrainSearch } from '@/api';
import { ADULT_TYPE, CHILD_TYPE, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { BookingParamsType, PassengerGuestType, TrainSearchPayloadType } from '@/types';

export default function useTrainSearch({
  trainIndex,
  bookingParams,
}: {
  trainIndex: number;
  bookingParams: BookingParamsType;
}) {
  const trainParams = bookingParams?.trains?.[trainIndex];
  const { mutateAsync, data, isPending, error, reset } = useMutation({
    mutationFn: (payload: TrainSearchPayloadType) => fetchTrainSearch(payload),
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
    // TODO: payload train search
    let totalAdult = 0;
    let totalChild = 0;
    let totalInfant = 0;
    bookingParams?.paxList?.forEach((pax: PassengerGuestType) => {
      if (pax?.type === ADULT_TYPE) {
        totalAdult++;
      } else if (pax?.type === CHILD_TYPE) {
        totalChild++;
      } else {
        totalInfant++;
      }
    });
    const payload: TrainSearchPayloadType = {
      journey: {
        depStationCode: values.origin,
        arrStationCode: values.destination,
        depDate: dayjs(values.departureDate).format('MM-DD-YYYY'),
        seatClass: values?.trainClass ?? 'ECONOMY',
        sortBy: values.sortBy ?? 'ARRIVAL_TIME',
      },
      passengers: {
        adult: String(totalAdult),
        child: String(totalChild),
        infant: String(totalInfant),
      },
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
