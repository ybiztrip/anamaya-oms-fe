import type { BookingTypeType } from './booking';

export type RefundCreatePayloadType = {
  bookingType: BookingTypeType;
  bookingFlightId?: number;
  bookingHotelId?: number;
  requestedAmount: number;
  remarks: string;
};

export type RefundPaidPayloadType = {
  type: BookingTypeType;
  partnerBookingId: string;
  paidAmount: number;
  remarks: string;
};

export type RefundCancelPayloadType = {
  type: BookingTypeType;
  partnerBookingId: string;
  paidAmount: number;
  remarks: string;
};

export type RefundListPayloadType = {
  bookingType: BookingTypeType;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  status?: string;
  page: number;
  size: number;
};

export type RefundListResponseType = {
  id: number;
  bookingCode: string;
  bookingType: BookingTypeType;
  partnerBookingId: string;
  amount: number;
};
