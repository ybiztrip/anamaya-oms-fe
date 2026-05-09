import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import useTravelPolicy from '@/hooks/useTravelPolicy';
import type { TravelPolicyType } from '@/types';

export type SelectTravelPolicyProps = Omit<SelectProps, 'options' | 'loading'>;

function SelectTravelPolicy({ ...props }: SelectTravelPolicyProps) {
  const { data, isLoading, error } = useTravelPolicy();

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
