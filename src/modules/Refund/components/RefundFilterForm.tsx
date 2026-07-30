import { Col, DatePicker, Row } from 'antd';

import type { RefundFilters } from '../types';

type RefundFilterFormProps = Readonly<{
  value: RefundFilters;
  onChange: (value: RefundFilters) => void;
}>;

export default function RefundFilterForm({ value, onChange }: RefundFilterFormProps) {
  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} md={24}>
        <DatePicker.RangePicker
          className="w-full"
          value={value.dateRange}
          onChange={(range) =>
            onChange({
              ...value,
              dateRange: range?.[0] && range?.[1] ? [range[0], range[1]] : null,
            })
          }
          placeholder={['Start Date', 'End Date']}
          allowClear
        />
      </Col>
    </Row>
  );
}
