import type { BookingFlightType, BookingHotelType } from './booking';

export type DepositCodeType = 'WALLET_FLIGHT' | 'WALLET_HOTEL';

export type DepositBalanceType = {
  id: number;
  companyId: number;
  code: DepositCodeType;
  balance: number;
  currency: string;
  status: number;
  createdAt: string;
  updatedAt: string;
};

export type DepositTransactionType = {
  id: number;
  referenceId: number;
  referenceCode: string;
  sourceType: string;
  type: string;
  amount: number;
  beginBalance: number;
  endBalance: number;
  remarks: string;
  createdAt: string;
};

export type DepositTransactionsResponseType = {
  balance: DepositBalanceType;
  transactions: {
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
    details: DepositTransactionType[];
  };
};

export type DepositMonitoringType = {
  id: number;
  companyId: number;
  balanceCode: DepositCodeType;
  referenceCode: string;
  referenceId: number;
  sourceType: string;
  bookingType: string;
  type: string;
  amount: number;
  beginBalance: number;
  endBalance: number;
  remarks: string;
  createdAt: string;
  bookingFlights?: BookingFlightType[];
  bookingHotels?: BookingHotelType[];
};

export type DepositMonitoringPayloadType = {
  page: number;
  size: number;
  balanceCodeType: DepositCodeType;
};
