import { Col, DatePicker, Input, Row, Select } from 'antd';

import {
  BOOKING_STATUS_APPROVED,
  BOOKING_STATUS_BOOKED,
  BOOKING_STATUS_CANCELLED,
  BOOKING_STATUS_ISSUED,
  BOOKING_STATUS_REJECTED,
} from '@/constants/common';

import type { ReportHotelFilters } from '../types';

type ReportHotelFilterFormProps = Readonly<{
  value: ReportHotelFilters;
  onChange: (value: ReportHotelFilters) => void;
}>;

export default function ReportHotelFilterForm({ value, onChange }: ReportHotelFilterFormProps) {
  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} md={12}>
        <Input
          placeholder="Booking Code"
          value={value.bookingCode}
          onChange={(e) => onChange({ ...value, bookingCode: e.target.value.trim() })}
        />
      </Col>
      <Col xs={24} md={12}>
        <Select
          className="w-full"
          placeholder="Status"
          allowClear
          value={value.status}
          onChange={(status) => onChange({ ...value, status })}
          options={[
            { label: BOOKING_STATUS_BOOKED, value: BOOKING_STATUS_BOOKED },
            { label: BOOKING_STATUS_APPROVED, value: BOOKING_STATUS_APPROVED },
            { label: BOOKING_STATUS_ISSUED, value: BOOKING_STATUS_ISSUED },
            { label: BOOKING_STATUS_CANCELLED, value: BOOKING_STATUS_CANCELLED },
            { label: BOOKING_STATUS_REJECTED, value: BOOKING_STATUS_REJECTED },
          ]}
        />
      </Col>
      <Col xs={24} md={12}>
        <DatePicker.RangePicker
          className="w-full"
          value={value.checkInDateRange}
          onChange={(range) =>
            onChange({
              ...value,
              checkInDateRange: range?.[0] && range?.[1] ? [range[0], range[1]] : null,
            })
          }
          placeholder={['Check In Start', 'Check In End']}
          allowClear
        />
      </Col>
      <Col xs={24} md={12}>
        <DatePicker.RangePicker
          className="w-full"
          value={value.checkOutDateRange}
          onChange={(range) =>
            onChange({
              ...value,
              checkOutDateRange: range?.[0] && range?.[1] ? [range[0], range[1]] : null,
            })
          }
          placeholder={['Check Out Start', 'Check Out End']}
          allowClear
        />
      </Col>
    </Row>
  );
}
