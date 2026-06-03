import { Col, DatePicker, Input, Row, Select } from 'antd';

import { BOOKING_HOTEL_STATUSES } from '@/constants/common';

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
          options={BOOKING_HOTEL_STATUSES.map((status) => ({ label: status, value: status }))}
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
