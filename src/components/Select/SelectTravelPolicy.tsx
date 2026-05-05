import { useQuery } from '@tanstack/react-query';
import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import { fetchTravelPolicies } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { TRAVEL_POLICIES } from '@/constants/queryKey';
import type { TravelPolicyType } from '@/types';

export type SelectTravelPolicyProps = Omit<SelectProps, 'options' | 'loading'>;

function SelectTravelPolicy({ ...props }: SelectTravelPolicyProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [TRAVEL_POLICIES],
    queryFn: () =>
      fetchTravelPolicies({
        size: DEFAULT_PAGE_SIZE,
        page: 0,
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const options = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((travelPolicy: TravelPolicyType) => ({
      label: travelPolicy.name,
      value: travelPolicy.id,
      travelPolicy,
    }));
  }, [data?.data]);

  return (
    <Select
      loading={isLoading}
      options={options}
      style={{ width: '100%' }}
      status={error ? 'error' : undefined}
      notFoundContent={isLoading ? 'Loading travel policies…' : 'No travel policies'}
      {...props}
    />
  );
}
export default SelectTravelPolicy;
