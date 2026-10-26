import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import { APPROVAL_PATH } from '@/constants/routePath';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import type { BookingParamsType, BookingPriceItemType } from '@/types';
import { sessionStorageGet, sessionStorageRemove } from '@/utils/sessionStorage';

import useBooking from './useBooking';
import useBookingAttachment from './useBookingAttachment';
import useBookingFlight from './useBookingFlight';
import useBookingHotel from './useBookingHotel';
import useBookingTrain from './useBookingTrain';

export default function useBookingConfirm({
  flightPrices,
  hotelPrices,
}: {
  flightPrices?: Record<number, BookingPriceItemType[]>;
  hotelPrices?: BookingPriceItemType[];
}) {
  const navigate = useNavigate();
  const { createBooking, isLoading: isCreatingBooking } = useBooking();
  const { submitFlight, isLoading: isSubmittingFlight } = useBookingFlight();
  const { submitHotel, isLoading: isSubmittingHotel } = useBookingHotel();
  const { submitTrainSeats, isLoading: isSubmittingTrain } = useBookingTrain();
  const { submitAttachments, isLoading: isSubmittingAttachment } = useBookingAttachment();

  const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);
  const {
    flights = [],
    hotel,
    trains = [],
    attachments = [],
    bookingId: existingBookingId,
  } = bookingParams ?? {};

  const handleSubmitForApproval = async (values: any) => {
    if (!bookingParams) return;

    try {
      // Train booking is created earlier (on schedule select). Confirm only sets seats.
      if (trains.length && existingBookingId) {
        await submitTrainSeats({
          bookingId: String(existingBookingId),
          bookingParams,
          values,
        });
        await submitAttachments({
          bookingId: String(existingBookingId),
          attachments,
        });
      } else {
        const createBookingsResponse = await createBooking(bookingParams);
        const bookingId = createBookingsResponse?.data?.id?.toString() ?? '';

        if (flights.length) {
          await submitFlight({
            bookingId,
            bookingParams,
            values,
            flightPrices,
          });
        }
        if (hotel) {
          await submitHotel({
            bookingId,
            bookingParams,
            values,
            hotelPrices,
          });
        }
        await submitAttachments({ bookingId, attachments });
      }

      message.success('Booking submitted for approval');
      sessionStorageRemove(BOOKING_PARAMS);
      navigate(`${APPROVAL_PATH}?tab=my-request`);
    } catch (e: any) {
      console.error('e', e);
    }
  };

  return {
    bookingParams,
    handleSubmitForApproval,
    isLoading:
      isCreatingBooking ||
      isSubmittingFlight ||
      isSubmittingHotel ||
      isSubmittingTrain ||
      isSubmittingAttachment,
  };
}
