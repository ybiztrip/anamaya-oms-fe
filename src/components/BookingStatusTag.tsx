import { Tag } from 'antd';

import {
  BOOKING_STATUS_APPROVED,
  BOOKING_STATUS_BOOKED,
  BOOKING_STATUS_REJECTED,
} from '@/constants/common';

interface BookingStatusTagProps {
  status?: string;
  className?: string;
}

const BOOKING_STATUS_COLOR_MAP: Record<string, string> = {
  [BOOKING_STATUS_BOOKED]: 'blue',
  [BOOKING_STATUS_APPROVED]: 'green',
  [BOOKING_STATUS_REJECTED]: 'red',
};

function BookingStatusTag({ status, className }: Readonly<BookingStatusTagProps>) {
  if (!status) return null;

  return (
    <Tag color={BOOKING_STATUS_COLOR_MAP[status] ?? 'default'} className={className}>
      {status}
    </Tag>
  );
}

export default BookingStatusTag;
