import { useQuery } from '@tanstack/react-query';
import { Select, type SelectProps } from 'antd';
import { useMemo, useState } from 'react';

import { fetchHotelGeoList } from '@/api';
import { HOTEL_GEO_LIST } from '@/constants/queryKey';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import type { HotelGeoListType } from '@/types';

export type SelectHotelGeoProps = Omit<SelectProps, 'options' | 'loading' | 'onSearch'> & {
  onSearch?: SelectProps['onSearch'];
};

const DEFAULT_LIMIT = 20;

export default function SelectHotelGeo({ onSearch, ...props }: SelectHotelGeoProps) {
  const [searchInput, setSearchInput] = useState('');
  const debouncedInput = useDebouncedValue(searchInput, 400);
  const searchKey = debouncedInput.trim();

  const { data, isLoading, error } = useQuery({
    queryKey: [HOTEL_GEO_LIST, searchKey],
    queryFn: () =>
      fetchHotelGeoList({
        countryCode: 'ID',
        offset: '0',
        key: searchKey,
        limit: String(DEFAULT_LIMIT),
      }),
    enabled: !!searchKey,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const options = useMemo(() => {
    const list = data?.data
      ? Array.isArray(data.data)
        ? data.data
        : [data.data]
      : [];

    return list.map((geo: HotelGeoListType) => ({
      value: geo.geoId,
      label: geo.localeName || geo.name,
      geo,
    }));
  }, [data]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    onSearch?.(value);
  };

  return (
    <Select
      showSearch
      filterOption={false}
      loading={isLoading}
      options={options}
      style={{ width: '100%' }}
      status={error ? 'error' : undefined}
      notFoundContent={isLoading ? 'Loading locations…' : 'Type to search location'}
      onSearch={handleSearch}
      {...props}
    />
  );
}