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
  bookingId: string;
  paidAmount: number;
  remarks: string;
};

export type RefundCancelPayloadType = {
  type: BookingTypeType;
  partnerBookingId: string;
  bookingId: string;
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
  companyId: number;
  code: string;
  bookingType: BookingTypeType;
  bookingCode: string;
  otaReference: string;
  paymentMethod: string;
  requestedAmount: number;
  paidAmount: number | null;
  currency: string;
  status: string;
  remarks: string;
  paidAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};
