import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { CREATE_TRAIN_SEARCH_PATH } from '@/constants/routePath';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import type { BookingParamsType } from '@/types';
import { sessionStorageSet } from '@/utils/sessionStorage';

import useBooking from './useBooking';
import useBookingTrain from './useBookingTrain';

function needsTrainBookingCreate(bookingParams: BookingParamsType | null) {
  const trains = bookingParams?.trains ?? [];
  if (!trains.length) return false;
  if (trains.some((train) => !train.selectedTrain)) return false;
  if (!bookingParams?.bookingId) return true;
  return trains.some((train) => !train.trainId);
}

export default function useEnsureTrainBooking({
  bookingParams,
  onBookingParamsChange,
}: {
  bookingParams: BookingParamsType | null;
  onBookingParamsChange: (next: BookingParamsType) => void;
}) {
  const navigate = useNavigate();
  const { createBooking, isLoading: isCreatingBooking } = useBooking();
  const { submitTrains, isLoading: isSubmittingTrain } = useBookingTrain();
  const startedRef = useRef(false);
  const createBookingRef = useRef(createBooking);
  const submitTrainsRef = useRef(submitTrains);

  useEffect(() => {
    createBookingRef.current = createBooking;
    submitTrainsRef.current = submitTrains;
  }, [createBooking, submitTrains]);

  const needsCreate = needsTrainBookingCreate(bookingParams);

  useEffect(() => {
    if (!needsCreate) {
      startedRef.current = false;
      return;
    }
    if (!bookingParams || startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        const hasSelectedTrain = (bookingParams.trains ?? []).some((train) =>
          Boolean(train.selectedTrain),
        );
        if (!hasSelectedTrain) {
          throw new Error('No selected train');
        }

        const createResponse = await createBookingRef.current(bookingParams);
        const bookingId = createResponse?.data?.id;
        if (!bookingId) {
          throw new Error('Booking id not found');
        }

        const { trains, bookingPaxIds } = await submitTrainsRef.current({
          bookingId: String(bookingId),
          bookingParams,
        });

        if (cancelled) {
          startedRef.current = false;
          return;
        }

        const nextParams: BookingParamsType = {
          ...bookingParams,
          bookingId: Number(bookingId),
          bookingPaxIds,
          trains,
        };
        sessionStorageSet(BOOKING_PARAMS, nextParams);
        onBookingParamsChange(nextParams);
      } catch (e) {
        console.error(e);
        startedRef.current = false;
        if (!cancelled) {
          navigate(CREATE_TRAIN_SEARCH_PATH);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookingParams, navigate, needsCreate, onBookingParamsChange]);

  return {
    isCreatingTrainBooking: isCreatingBooking || isSubmittingTrain || needsCreate,
  };
}
