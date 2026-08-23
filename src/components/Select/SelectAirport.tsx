import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import useFlightAirport from '@/hooks/useFlightAirport';

export type SelectAirportProps = Omit<SelectProps, 'options' | 'loading'>;

export default function SelectAirport({ ...props }: SelectAirportProps) {
  const { data, isLoading, error } = useFlightAirport();

  const options = useMemo(() => {
    const airports = data?.data ?? [];
    return airports.map((a) => {
      const code = a.airportCode;
      const city = a.localCityName;

      return {
        value: code,
        label: `${code} — ${city}`,
        city: city,
        airport: a,
      };
    });
  }, [data]);

  return (
    <Select
      loading={isLoading}
      options={options}
      style={{ width: '100%' }}
      status={error ? 'error' : undefined}
      notFoundContent={isLoading ? 'Loading airports…' : 'No airports'}
      showSearch={{
        optionFilterProp: ['label', 'city'],
      }}
      {...props}
    />
  );
}
