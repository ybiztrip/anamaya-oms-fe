import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import useTrainStation from '@/hooks/useTrainStation';

export type SelectTrainStationProps = Omit<SelectProps, 'options' | 'loading'>;

export default function SelectTrainStation({ ...props }: SelectTrainStationProps) {
  const { data, isLoading, error } = useTrainStation();

  const options = useMemo(() => {
    const stations = data?.data ?? [];
    return stations.map((s) => {
      return {
        value: s.stationCode,
        label: `${s.stationCode} - ${s.stationName} - (${s.cityName})`,
        station: s,
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
      showSearch={{
        optionFilterProp: ['label'],
      }}
      {...props}
    />
  );
}
