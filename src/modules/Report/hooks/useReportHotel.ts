import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { exportBookingsHotels, fetchBookingsHotels } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { REPORT_HOTELS } from '@/constants/queryKey';
import type { BookingHotelsPayloadType } from '@/types';

import type { ReportHotelFilters } from '../types';

export default function useReportHotel(filters?: ReportHotelFilters) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const payload: BookingHotelsPayloadType = useMemo(
    () => ({
      page: page - 1,
      size: pageSize,
      bookingCode: filters?.bookingCode,
      checkInStartDate: filters?.checkInDateRange
        ? filters?.checkInDateRange?.[0]?.format('YYYY-MM-DD')
        : undefined,
      checkInEndDate: filters?.checkInDateRange
        ? filters?.checkInDateRange?.[1]?.format('YYYY-MM-DD')
        : undefined,
      checkOutStartDate: filters?.checkOutDateRange
        ? filters?.checkOutDateRange?.[0]?.format('YYYY-MM-DD')
        : undefined,
      checkOutEndDate: filters?.checkOutDateRange
        ? filters?.checkOutDateRange?.[1]?.format('YYYY-MM-DD')
        : undefined,
      status: filters?.status || undefined,
    }),
    [page, pageSize, filters],
  );

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [REPORT_HOTELS, payload],
    queryFn: () => fetchBookingsHotels(payload),
  });

  const exportMutation = useMutation({
    mutationFn: () => exportBookingsHotels(payload),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: [REPORT_HOTELS] });

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    data,
    isLoading: isLoading || isFetching,
    error,
    refresh,
    exportReportHotels: exportMutation.mutateAsync,
    isExporting: exportMutation.isPending,
  };
}
