import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchRoles } from '@/api';
import { ROLES } from '@/constants/queryKey';

export default function useRole() {
  const { data, isLoading, error } = useQuery({
    queryKey: [ROLES],
    queryFn: fetchRoles,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const rolesByCode = useMemo(() => {
    const list = data?.data ?? [];
    return Object.fromEntries(list.map((r) => [r.code, r]));
  }, [data]);

  const rolesById = useMemo(() => {
    const list = data?.data ?? [];
    return Object.fromEntries(list.map((r) => [r.id, r]));
  }, [data]);

  return {
    data,
    rolesByCode,
    rolesById,
    isLoading: isLoading,
    error: error,
  };
}
