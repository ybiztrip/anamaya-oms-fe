import { Col, Divider, Form, Input, InputNumber, Row, Select, Switch, Typography } from 'antd';

import { FLIGHT_CLASS_OPTIONS, FLIGHT_CLASS_RANK } from '@/constants/common';
import { rupiahFormatter, rupiahParser } from '@/utils/formatter';

export default function TravelPolicyForm({ mode = 'create' }: { mode?: 'create' | 'update' }) {
  return (
    <div>
      <section>
        <Row gutter={[16, 8]}>
          <Col xs={24} hidden>
            <Form.Item name="id">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Policy Name"
              name="name"
              rules={[{ required: true, message: 'Policy Name required' }]}
            >
              <Input placeholder="Policy Name" />
            </Form.Item>
          </Col>
          {mode === 'update' && (
            <Col xs={24} md={12}>
              <Form.Item label="Status" name="status">
                <Select
                  placeholder="Select Status"
                  options={[
                    { label: 'Active', value: 1 },
                    { label: 'Inactive', value: 0 },
                  ]}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </section>

      <section>
        <Typography.Title level={5}>Flight</Typography.Title>
        <Divider className="my-2" />
        <Row gutter={[16, 8]} className="mt-4">
          <Col xs={24}>
            <Form.Item label="Including Garuda Indonesia" layout="horizontal">
              <Form.Item name="includingGarudaAirline" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Flight Minimum Price" name="flightMinimumPrice">
              <InputNumber
                placeholder="Flight Minimum Price"
                min={0}
                formatter={rupiahFormatter}
                parser={rupiahParser}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Flight Maximum Price"
              name="flightMaximumPrice"
              rules={[
                { required: true, message: 'Maximum Price required' },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const min = getFieldValue('flightMinimumPrice');
                    if (value === undefined || min === undefined) return Promise.resolve();
                    return value >= min
                      ? Promise.resolve()
                      : Promise.reject(new Error('Maximum price must be >= minimum price'));
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder="Flight Maximum Price"
                min={0}
                formatter={rupiahFormatter}
                parser={rupiahParser}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Flight Minimum Class" name="flightMinimumClass">
              <Select options={FLIGHT_CLASS_OPTIONS} placeholder="Select Flight Minimum Class" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Flight Maximum Class"
              name="flightMaximumClass"
              rules={[
                { required: true, message: 'Flight Class required' },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const min = getFieldValue('flightMinimumClass');
                    if (value === undefined || min === undefined) return Promise.resolve();
                    return FLIGHT_CLASS_RANK[value] >= FLIGHT_CLASS_RANK[min]
                      ? Promise.resolve()
                      : Promise.reject(new Error('Maximum class must be >= minimum class'));
                  },
                }),
              ]}
            >
              <Select options={FLIGHT_CLASS_OPTIONS} placeholder="Select Flight Maximum Class" />
            </Form.Item>
          </Col>
        </Row>
      </section>

      <section>
        <Typography.Title level={5}>Hotel</Typography.Title>
        <Divider className="my-2" />
        <Row gutter={[16, 8]} className="mt-4">
          <Col xs={24} md={12}>
            <Form.Item label="Hotel Minimum Price" name="hotelMinimumPrice">
              <InputNumber
                placeholder="Hotel Minimum Price"
                min={0}
                formatter={rupiahFormatter}
                parser={rupiahParser}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Hotel Maximum Price"
              name="hotelMaximumPrice"
              rules={[
                { required: true, message: 'Maximum Price required' },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const min = getFieldValue('hotelMinimumPrice');
                    if (value === undefined || min === undefined) return Promise.resolve();
                    return value >= min
                      ? Promise.resolve()
                      : Promise.reject(new Error('Maximum price must be >= minimum price'));
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder="Hotel Maximum Price"
                min={0}
                formatter={rupiahFormatter}
                parser={rupiahParser}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Hotel Minimum Class" name="hotelMinimumClass">
              <Select
                options={[1, 2, 3, 4, 5].map((n) => ({ label: n, value: n }))}
                placeholder="Select Hotel Minimum Class"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Hotel Maximum Class"
              name="hotelMaximumClass"
              rules={[
                { required: true, message: 'Hotel Class required' },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const min = getFieldValue('hotelMinimumClass');
                    if (value === undefined || min === undefined) return Promise.resolve();
                    return value >= min
                      ? Promise.resolve()
                      : Promise.reject(new Error('Maximum class must be >= minimum class'));
                  },
                }),
              ]}
            >
              <Select
                options={[1, 2, 3, 4, 5].map((n) => ({ label: n, value: n }))}
                placeholder="Select Hotel Maximum Class"
              />
            </Form.Item>
          </Col>
        </Row>
      </section>
    </div>
  );
}
