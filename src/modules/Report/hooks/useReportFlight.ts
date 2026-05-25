import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { fetchBookingsFlights } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { REPORT_FLIGHTS } from '@/constants/queryKey';
import type { BookingListPayloadType } from '@/types';

import type { ReportFlightFilters } from '../types';

export default function useReportFlight(filters?: ReportFlightFilters) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const payload: BookingListPayloadType = useMemo(
    () => ({
      page: page - 1,
      size: pageSize,
      bookingCode: filters?.bookingCode,
    }),
    [page, pageSize, filters?.bookingCode],
  );

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [REPORT_FLIGHTS, payload],
    queryFn: () => fetchBookingsFlights(payload),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: [REPORT_FLIGHTS] });

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    data,
    isLoading: isLoading || isFetching,
    error,
    refresh,
  };
}
