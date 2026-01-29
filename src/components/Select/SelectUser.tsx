import { useQuery } from '@tanstack/react-query';
import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import { fetchUsers } from '@/api';
import { USERS } from '@/constants/queryKey';
import type { UserType } from '@/types';

export type SelectUserProps = Omit<SelectProps, 'options' | 'loading'>

function SelectUser({ ...props }: SelectUserProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [USERS],
    queryFn: fetchUsers,
  });

  const options = useMemo(() => {
      return data?.data?.map((user: UserType) => ({
      label: user.email,
      value: user.email,
      user,
    }));
  }, [data?.data]);

  return (
    <Select
      loading={isLoading}
      options={options}
      style={{ width: '100%' }}
      status={error ? 'error' : undefined}
      notFoundContent={isLoading ? 'Loading users…' : 'No users'}
      {...props}
    />
  );
}
export default SelectUser;
