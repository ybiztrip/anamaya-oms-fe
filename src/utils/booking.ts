import {
  BOOKING_STATUS_APPROVED,
  BOOKING_STATUS_BOOKED,
  BOOKING_STATUS_REJECTED,
} from '@/constants/common';
import type { BookingType } from '@/types';

export const getBookingOverallStatus = (
  data: BookingType,
): { status: string; approvedAt?: string; rejectedAt?: string } => {
  const result = {
    status: '',
    approvedAt: '',
    rejectedAt: '',
  };
  const statuses = [
    {
      status: data.status,
      approvedAt: data.approvedAt,
      rejectedAt: data.rejectedAt,
    },
    ...data.flights.map((flight) => ({
      status: flight.status,
      approvedAt: flight.approvedAt,
      rejectedAt: flight.rejectedAt,
    })),
    ...data.hotels.map((hotel) => ({
      status: hotel.status,
      approvedAt: hotel.approvedAt,
      rejectedAt: hotel.rejectedAt,
    })),
  ];

  if (statuses.some((status) => status.status === BOOKING_STATUS_BOOKED)) {
    return {
      ...result,
      status: BOOKING_STATUS_BOOKED,
    };
  }

  const statusRejectIndex = statuses.findIndex(
    (status) => status.status === BOOKING_STATUS_REJECTED,
  );
  if (statusRejectIndex !== -1) {
    return {
      ...result,
      status: BOOKING_STATUS_REJECTED,
      rejectedAt: statuses[statusRejectIndex].rejectedAt,
    };
  }

  const approvedStatus =
    statuses.find((status) => Boolean(status.approvedAt)) ??
    statuses.find((status) => status.status === BOOKING_STATUS_APPROVED);

  return {
    ...result,
    status: BOOKING_STATUS_APPROVED,
    approvedAt: approvedStatus.approvedAt,
  };
};
