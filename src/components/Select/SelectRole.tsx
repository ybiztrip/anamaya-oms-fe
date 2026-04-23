import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import useRole from '@/hooks/useRole';

export type SelectRoleProps = Omit<SelectProps, 'options' | 'loading'>;

export default function SelectRole({ ...props }: SelectRoleProps) {
  const { data, isLoading, error } = useRole();

  const options = useMemo(() => {
    const roles = data?.data ?? [];
    return roles.map((r) => {
      return {
        value: r.id,
        label: r.name,
        role: r,
      };
    });
  }, [data]);

  return (
    <Select
      loading={isLoading}
      options={options}
      style={{ width: '100%' }}
      status={error ? 'error' : undefined}
      notFoundContent={isLoading ? 'Loading roles…' : 'No roles'}
      {...props}
    />
  );
}
