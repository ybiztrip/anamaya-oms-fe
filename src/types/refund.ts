export type RefundCreatePayloadType = {
  bookingType: string;
  bookingFlightId?: number;
  bookingHotelId?: number;
  requestedAmount: number;
  remarks: string;
};

export type RefundListPayloadType = {
  bookingType: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  status?: string;
  page: number;
  size: number;
};

export type RefundListResponseType = {
  id: number;
};
