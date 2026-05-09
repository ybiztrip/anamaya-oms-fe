import { useInfiniteQuery } from '@tanstack/react-query';
import { Timeline } from 'antd';
import { useEffect, useMemo, useRef } from 'react';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [ACTIVITY_LOGS, type, referenceId],
    enabled: referenceId > 0,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchActivityLogs({
        type,
        referenceId,
        page: pageParam,
        size: DEFAULT_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });

  useEffect(() => {
    const root = scrollRef.current;
    const el = sentinelRef.current;
    if (!root || !el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root, rootMargin: '80px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, data?.pages.length]);

  const items = useMemo(() => {
    const list =
      data?.pages.flatMap((page) =>
        page.data.map((item) => ({
          title: dayjs(item.createdAt).format('DD MMM YYYY HH:mm'),
          content: item.changeSummary?.join(', ') ?? 'No changes',
        })),
      ) ?? [];

    if (isLoading) {
      return [
        ...list,
        {
          loading: true,
          content: 'Loading...',
        },
      ];
    }

    if (isFetchingNextPage) {
      return [
        ...list,
        {
          loading: true,
          content: 'Loading more...',
        },
      ];
    }

    return list;
  }, [data?.pages, isLoading, isFetchingNextPage]);

  const hasLogs = (data?.pages.flatMap((p) => p.data).length ?? 0) > 0;

  if (referenceId <= 0) {
    return null;
  }

  return (
    <div ref={scrollRef} style={{ maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
      {isLoading || hasLogs ? <Timeline mode="start" items={items} /> : null}
      {!isLoading && !hasLogs && (
        <div className="text-center text-sm text-gray-500 py-4">No activity yet</div>
      )}
      {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}
    </div>
  );
}
