import { Tag } from 'antd';

import {
  BOOKING_STATUS_APPROVED,
  BOOKING_STATUS_BOOKED,
  BOOKING_STATUS_CANCELLED,
  BOOKING_STATUS_ISSUED,
  BOOKING_STATUS_REJECTED,
} from '@/constants/common';

interface BookingStatusTagProps {
  status?: string;
  className?: string;
  size?: 'small' | 'default' | 'large';
}

const BOOKING_STATUS_COLOR_MAP: Record<string, string> = {
  [BOOKING_STATUS_BOOKED]: 'blue',
  [BOOKING_STATUS_APPROVED]: 'green',
  [BOOKING_STATUS_REJECTED]: 'red',
  [BOOKING_STATUS_ISSUED]: 'geekblue',
  [BOOKING_STATUS_CANCELLED]: 'volcano',
};

function BookingStatusTag({
  status,
  className,
  size = 'default',
}: Readonly<BookingStatusTagProps>) {
  if (!status) return null;

  let sizeClassName = '';
  if (size === 'small') {
    sizeClassName = 'text-[11px] leading-4 px-1 py-0';
  } else if (size === 'large') {
    sizeClassName = 'text-sm px-2 py-0.5';
  }
  const mergedClassName = [sizeClassName, className].filter(Boolean).join(' ');

  return (
    <Tag color={BOOKING_STATUS_COLOR_MAP[status] ?? 'default'} className={mergedClassName}>
      {status}
    </Tag>
  );
}

export default BookingStatusTag;
