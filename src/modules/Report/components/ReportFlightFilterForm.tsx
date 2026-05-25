import { Col, Input, Row } from 'antd';

import type { ReportFlightFilters } from '../types';

type ReportFlightFilterFormProps = Readonly<{
  value: ReportFlightFilters;
  onChange: (value: ReportFlightFilters) => void;
}>;

export default function ReportFlightFilterForm({ value, onChange }: ReportFlightFilterFormProps) {
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
