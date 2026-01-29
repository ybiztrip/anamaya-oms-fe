import { useQuery } from '@tanstack/react-query';
import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import { fetchAirports } from '@/api';
import { FLIGHT_AIRPORTS } from '@/constants/queryKey';

export type SelectAirportProps = Omit<SelectProps, 'options' | 'loading'>

export default function SelectAirport({
  ...props
}: SelectAirportProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [FLIGHT_AIRPORTS],
    queryFn: fetchAirports,
  });

  const options = useMemo(() => {
    const airports = data?.data ?? [];
    return airports.map((a) => {
      const code = a.airportCode;
      const city = a.localCityName || a.city;

      return {
        value: code,
        label: `${code} — ${city}`,
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
      {...props}
    />
  );
}