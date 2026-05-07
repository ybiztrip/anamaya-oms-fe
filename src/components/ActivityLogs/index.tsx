import { useQuery } from '@tanstack/react-query';
import { Timeline } from 'antd';
import { useMemo } from 'react';

import { fetchActivityLogs } from '@/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import { ACTIVITY_LOGS } from '@/constants/queryKey';
import type { ActivityLogType } from '@/types';
import dayjs from '@/utils/dayjs';

export type ActivityLogsProps = {
  type: ActivityLogType;
  referenceId: number;
};

export default function ActivityLogs({ type, referenceId }: ActivityLogsProps) {
  const { data, isLoading } = useQuery({
    queryKey: [ACTIVITY_LOGS, type, referenceId],
    queryFn: () =>
      fetchActivityLogs({
        type: type,
        referenceId: referenceId,
        page: 0,
        size: DEFAULT_PAGE_SIZE,
      }),
  });

  const items = useMemo(() => {
    const list =
      data?.data.map((item) => ({
        title: dayjs(item.createdAt).format('DD MMM YYYY HH:mm'),
        content: item.createdBy,
      })) ?? [];
    if (isLoading) {
      return [
        ...list,
        {
          loading: true,
          content: 'Loading...',
        },
      ];
    }
    return list;
  }, [data?.data, isLoading]);

  return <Timeline mode="start" items={items} />;
}
