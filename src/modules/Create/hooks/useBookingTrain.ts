import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useCallback } from 'react';

import { submitBookingsTrain, submitBookingsTrainSeat } from '@/api';
import { CLIENT_SOURCE, DEFAULT_ERROR_MESSAGE, DEFAULT_HOLD_MS, INFANT_TYPE } from '@/constants/common';
import { USER } from '@/constants/storageKey';
import type {
  BookingParamsType,
  BookingPriceItemType,
  BookingTrainPayloadType,
  BookingTrainResponseType,
  PassengerGuestType,
  TrainJourneyType,
  TrainSeatSetPayloadType,
  UserType,
} from '@/types';
import { localStorageGet } from '@/utils/localStorage';

import { getBookingPaxPayload } from '../utils/bookingPaxMapper';

type BookingTrainSubmitResult = BookingTrainResponseType['trains'][number];

function buildTrainPrices(
  trainJourney: TrainJourneyType,
  trainName: string,
  paxList: PassengerGuestType[],
): BookingPriceItemType[] {
  const activeSegment =
    trainJourney.segments?.find((segment) => segment.active) ?? trainJourney.segments?.[0];
  const fareAmount = Number(activeSegment?.fare ?? 0);
  const totalAdult = paxList.filter((pax) => pax?.type !== INFANT_TYPE).length;

  if (totalAdult <= 0) return [];

  return [
    {
      item: `Train ${trainName} (Adult) x${totalAdult}`,
      currency: 'IDR',
      amount: fareAmount * totalAdult,
    },
  ];
}

function buildTrainPayloadItem({
  trainJourney,
  trainName,
  paxList,
  booker,
}: {
  trainJourney: TrainJourneyType;
  trainName: string;
  paxList: PassengerGuestType[];
  booker?: string;
}) {
  const activeSegment =
    trainJourney.segments?.find((segment) => segment.active) ?? trainJourney.segments?.[0];

  return {
    clientSource: CLIENT_SOURCE,
    classKey: activeSegment?.classKey ?? '',
    journeyCode: trainJourney.journeyCode,
    carrierNumber: trainJourney.carrierNumber,
    trainName: trainJourney.trainName,
    origin: trainJourney.origin,
    destination: trainJourney.destination,
    departureDatetime: `${trainJourney.departureDate}T${trainJourney.departureTime}:00`,
    arrivalDatetime: `${trainJourney.arrivalDate}T${trainJourney.arrivalTime}:00`,
    subClass: activeSegment?.subClass ?? '',
    seatClass: activeSegment?.className ?? '',
    provider: trainJourney.provider,
    paymentMethod: 'DEPOSIT',
    metadata: {
      prices: buildTrainPrices(trainJourney, trainName, paxList),
      booker,
      passengerNames: paxList.map((pax) => `${pax.firstName} ${pax.lastName}`),
    },
  };
}

function extractTrainPaxIds(train?: BookingTrainSubmitResult): number[] {
  return (train?.paxs ?? [])
    .map((pax) => Number(pax.id))
    .filter((id) => Number.isFinite(id) && id > 0);
}

export default function useBookingTrain() {
  const { mutateAsync: submitTrainMutateAsync, isPending: isSubmittingTrain } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookingTrainPayloadType }) =>
      submitBookingsTrain(id, payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const { mutateAsync: submitTrainSeatMutateAsync, isPending: isSubmittingTrainSeat } =
    useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: TrainSeatSetPayloadType }) =>
        submitBookingsTrainSeat(id, payload),
      onError: (e: any) => {
        message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
      },
    });

  const submitTrains = useCallback(
    async ({
      bookingId,
      bookingParams,
    }: {
      bookingId: string;
      bookingParams: BookingParamsType;
    }) => {
      const userProfile = localStorageGet<UserType>(USER);
      const trains = bookingParams.trains ?? [];
      const paxList = bookingParams.paxList ?? [];
      const selectedTrainEntries = trains
        .map((train, index) => ({ train, index, selectedTrain: train.selectedTrain }))
        .filter(
          (entry): entry is typeof entry & { selectedTrain: TrainJourneyType } =>
            Boolean(entry.selectedTrain),
        );

      if (!selectedTrainEntries.length) {
        throw new Error('No selected train');
      }

      const paxs = paxList.map(getBookingPaxPayload);
      const trainsWithIds = [...trains];
      let bookingPaxIds: number[] = [];

      for (const entry of selectedTrainEntries) {
        const trainResponse = await submitTrainMutateAsync({
          id: bookingId,
          payload: {
            train: buildTrainPayloadItem({
              trainJourney: entry.selectedTrain,
              trainName: entry.train.name || entry.selectedTrain.trainName || 'Train',
              paxList,
              booker: userProfile?.email,
            }),
            paxs,
          },
        });

        const responseTrain = trainResponse?.data?.trains?.[0] ?? [];

        trainsWithIds[entry.index] = {
          ...trainsWithIds[entry.index],
          trainId: responseTrain?.id ? Number(responseTrain.id) : undefined,
          timeLimit:
            responseTrain?.timeLimit ??
            new Date(Date.now() + DEFAULT_HOLD_MS).toISOString(),
        };

        if (!bookingPaxIds.length) {
          bookingPaxIds = extractTrainPaxIds(responseTrain);
        }
      }

      return {
        trains: trainsWithIds,
        bookingPaxIds,
      };
    },
    [submitTrainMutateAsync],
  );

  const submitTrainSeats = useCallback(
    async ({
      bookingId,
      bookingParams,
      values,
    }: {
      bookingId: string;
      bookingParams: BookingParamsType;
      values: any;
    }) => {
      const trains = bookingParams.trains ?? [];
      const paxList = bookingParams.paxList ?? [];
      const bookingPaxIds = bookingParams.bookingPaxIds ?? [];

      for (const [trainIndex, train] of trains.entries()) {
        if (!train.trainId) continue;

        const trainFormValues = values?.trains?.[`train-${trainIndex}`]?.paxs ?? {};

        const seats = paxList
          .map((_, paxIndex) => {
            const seat = trainFormValues?.[`pax-${paxIndex}`]?.seat as
              | { coachName?: string; seatNumber?: string }
              | undefined;
            const paxId = bookingPaxIds[paxIndex];
            if (!seat?.coachName || !seat?.seatNumber || !paxId) return null;
            return {
              paxId,
              coachName: seat.coachName,
              seatNumber: seat.seatNumber,
            };
          })
          .filter((seat): seat is NonNullable<typeof seat> => Boolean(seat));

        await submitTrainSeatMutateAsync({
          id: bookingId,
          payload: {
            trainId: train.trainId,
            seats,
          },
        });
      }
    },
    [submitTrainSeatMutateAsync],
  );

  return {
    submitTrains,
    submitTrainSeats,
    isLoading: isSubmittingTrain || isSubmittingTrainSeat,
  };
}
