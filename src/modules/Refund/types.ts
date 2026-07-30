import dayjs from 'dayjs';

export type RefundFilters = {
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
};
