import { useQuery } from '@tanstack/react-query';
import { Select, type SelectProps } from 'antd';
import { useMemo, useState } from 'react';

import { fetchUsers } from '@/api';
import { USERS } from '@/constants/queryKey';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import type { UserType } from '@/types';

export type SelectUserProps = Omit<SelectProps, 'options' | 'loading' | 'onSearch'> & {
  onSearch?: SelectProps['onSearch'];
};

const DEFAULT_LIMIT = 20;

function SelectUser({ onSearch, ...props }: SelectUserProps) {
  const [searchInput, setSearchInput] = useState('');
  const debouncedInput = useDebouncedValue(searchInput, 400);
  const searchKey = debouncedInput.trim().toLowerCase();

  const { data, isLoading, error } = useQuery({
    queryKey: [USERS, searchKey],
    queryFn: () =>
      fetchUsers({
        email: searchKey,
        size: String(DEFAULT_LIMIT),
        page: '0',
      }),
    enabled: !!searchKey,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const options = useMemo(() => {
    const list = data?.data ?? [];
    if (!searchKey) return [];

    return list.map((user: UserType) => ({
      label: user.email,
      value: user.email,
      user,
    }));
  }, [data?.data, searchKey]);

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
      notFoundContent={
        isLoading ? 'Loading users…' : searchKey ? 'No users' : 'Type to search user'
      }
      onSearch={handleSearch}
      {...props}
    />
  );
}
export default SelectUser;
