export type RefundPayloadType = {
  bookingType: string;
  bookingFlightId?: number;
  bookingHotelId?: number;
  requestedAmount: number;
  remarks: string;
};
