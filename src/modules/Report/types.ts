import dayjs from "dayjs";

export type ReportFlightFilters = {
  bookingCode?: string;
  departureDateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  arrivalDateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  status?: string;
};

export type ReportHotelFilters = {
  bookingCode?: string;
  checkInDateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  checkOutDateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  status?: string;
};