import { Button, Space } from 'antd';

import {
  BOOKING_TYPE_FLIGHT,
  BOOKING_TYPE_FLIGHT_HOTEL,
  BOOKING_TYPE_HOTEL,
  BOOKING_TYPE_TRAIN,
} from '@/constants/common';
import type { BookingTypeType } from '@/types';

const BOOKING_TYPE_OPTIONS: { key: BookingTypeType; label: string }[] = [
  { key: BOOKING_TYPE_FLIGHT, label: 'Flight' },
  { key: BOOKING_TYPE_HOTEL, label: 'Hotel' },
  { key: BOOKING_TYPE_FLIGHT_HOTEL, label: 'Flight + Hotel' },
  { key: BOOKING_TYPE_TRAIN, label: 'Train' },
];

function BookingTypeTabs({
  activeType,
  onChange,
}: Readonly<{
  activeType: BookingTypeType;
  onChange: (key: BookingTypeType) => void;
}>) {
  return (
    <Space>
      {BOOKING_TYPE_OPTIONS.map(({ key, label }) => (
        <Button
          key={key}
          variant="link"
          size="large"
          color={activeType === key ? 'primary' : 'default'}
          onClick={activeType === key ? undefined : () => onChange(key)}
        >
          {label}
        </Button>
      ))}
    </Space>
  );
}

export default BookingTypeTabs;
