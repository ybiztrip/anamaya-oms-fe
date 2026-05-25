import { Col, Input, Row } from 'antd';

import type { ReportHotelFilters } from '../types';

type ReportHotelFilterFormProps = Readonly<{
  value: ReportHotelFilters;
  onChange: (value: ReportHotelFilters) => void;
}>;

export default function ReportHotelFilterForm({ value, onChange }: ReportHotelFilterFormProps) {
  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} md={24}>
        <Input
          placeholder="Booking Code"
          value={value.bookingCode}
          onChange={(e) => onChange({ ...value, bookingCode: e.target.value.trim() })}
        />
      </Col>
    </Row>
  );
}
