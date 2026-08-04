import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { fetchRefundList } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { REFUNDS } from '@/constants/queryKey';
import type { BookingTypeType, RefundListPayloadType } from '@/types';

import type { RefundFilters } from '../types';

export default function useRefund({
  type,
  filters,
}: {
  type: BookingTypeType;
  filters?: RefundFilters;
}) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const payload: RefundListPayloadType = useMemo(
    () => ({
      bookingType: type,
      page: page - 1,
      size: pageSize,
      dateRange: filters?.dateRange ? filters?.dateRange?.[0]?.format('YYYY-MM-DD') : undefined,
      endDate: filters?.dateRange ? filters?.dateRange?.[1]?.format('YYYY-MM-DD') : undefined,
    }),
    [type, page, pageSize, filters?.dateRange],
  );

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [REFUNDS, payload],
    queryFn: () => fetchRefundList(payload),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: [REFUNDS] });

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
