import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import HoldCountdown from '@/components/HoldCountdown';
import { CREATE_TRAIN_SEARCH_PATH } from '@/constants/routePath';
import type { BookingTrainParamsType } from '@/types';
import dayjs from '@/utils/dayjs';

function TrainHoldCountdown({
  trains,
  isLoading = false,
}: Readonly<{
  trains?: BookingTrainParamsType[];
  isLoading?: boolean;
}>) {
  const navigate = useNavigate();

  const earliestTimeLimit = useMemo(() => {
    const deadlines = (trains ?? [])
      .map((train) => train.timeLimit)
      .filter((timeLimit): timeLimit is string => Boolean(timeLimit))
      .map((raw) => {
        const parsed = dayjs(raw);
        return parsed.isValid() ? { raw, ms: parsed.valueOf() } : null;
      })
      .filter((item): item is { raw: string; ms: number } => item !== null);

    if (!deadlines.length) return null;

    return deadlines.reduce((earliest, item) => (item.ms < earliest.ms ? item : earliest)).raw;
  }, [trains]);

  const handleExpire = useCallback(() => {
    navigate(CREATE_TRAIN_SEARCH_PATH);
  }, [navigate]);

  return (
    <HoldCountdown
      timeLimit={earliestTimeLimit}
      isLoading={isLoading}
      onExpire={handleExpire}
    />
  );
}

export default TrainHoldCountdown;
