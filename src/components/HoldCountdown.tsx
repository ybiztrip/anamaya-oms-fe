import { useEffect, useMemo, useState } from 'react';

import { DEFAULT_HOLD_MS } from '@/constants/common';
import dayjs from '@/utils/dayjs';

function parseTimeLimitMs(timeLimit?: string | null) {
  if (!timeLimit) return null;
  const parsed = dayjs(timeLimit);
  return parsed.isValid() ? parsed.valueOf() : null;
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function HoldCountdown({
  timeLimit,
  isLoading = false,
  defaultMs = DEFAULT_HOLD_MS,
  onExpire,
  label = 'Complete booking within',
}: Readonly<{
  timeLimit?: string | null;
  isLoading?: boolean;
  defaultMs?: number;
  onExpire?: () => void;
  label?: string;
}>) {
  const [defaultDeadlineMs] = useState(() => Date.now() + defaultMs);
  const [nowMs, setNowMs] = useState(() => Date.now());

  // Fallback default is only used while timeLimit is not yet known.
  const deadlineMs = useMemo(() => {
    const parsed = parseTimeLimitMs(timeLimit);
    if (parsed !== null) return parsed;
    return defaultDeadlineMs;
  }, [defaultDeadlineMs, timeLimit]);

  const remainingMs = Math.max(0, deadlineMs - nowMs);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setNowMs(now);
      if (deadlineMs - now <= 0) {
        onExpire?.();
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadlineMs, onExpire]);

  return (
    <div className="text-sm text-gray-600">
      {label}{' '}
      <span className="font-semibold tabular-nums">
        {isLoading && !timeLimit ? '…' : formatRemaining(remainingMs)}
      </span>
    </div>
  );
}

export default HoldCountdown;
