import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import useTrainStation from '@/hooks/useTrainStation';

export type SelectTrainStationProps = Omit<SelectProps, 'options' | 'loading'>;

export default function SelectTrainStation({ ...props }: SelectTrainStationProps) {
  const { data, isLoading, error } = useTrainStation();

  const options = useMemo(() => {
    const stations = data?.data ?? [];
    return stations.map((a) => {
      return {
        value: a.stationCode,
        label: a.name,
        station: a,
      };
    });
  }, [data]);

  return (
    <Select
      loading={isLoading}
      options={options}
      style={{ width: '100%' }}
      status={error ? 'error' : undefined}
      notFoundContent={isLoading ? 'Loading train stations…' : 'No train stations'}
      showSearch
      filterOption={false}
      {...props}
    />
  );
}
