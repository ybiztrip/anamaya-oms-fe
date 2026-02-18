import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Form, Row, Select, Space, Spin } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { CREATE_FLIGHT_SEARCH_PATH, CREATE_PATH } from '@/constants/routePath';
import type { FlightSearchOneWayType } from '@/types';

import FlightInfo from './components/FlightInfo';
import useBookingConfirm from './hooks/useBookingConfirm';

const FlightConfirmSection = ({
  index,
  flight,
}: {
  index: number;
  flight: FlightSearchOneWayType;
}) => {
  return (
    <div>
      <FlightInfo flight={flight} withSelect={false} />
      <Space className="mt-4">
        <Form.Item
          name={['flights', index, 'baggage']}
          label="Baggage"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Baggage"
            options={[
              { label: '20kg', value: '20KG' },
              { label: '30kg', value: '30KG' },
              { label: '40kg', value: '40KG' },
              { label: '50kg', value: '50KG' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Button color="primary" variant="filled" block>
            Add more baggage
          </Button>
        </Form.Item>
        {/* TODO: Add more baggage */}
      </Space>
      <Form.Item className="mb-0" name={['flights', index, 'freeRefund']} valuePropName="checked">
        <Checkbox>Refund reschedule insurance</Checkbox>
      </Form.Item>
    </div>
  );
};

function BookingConfirmView() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { handleSubmitForApproval, bookingParams } = useBookingConfirm();

  useEffect(() => {
    if (!bookingParams) {
      navigate(CREATE_PATH);
    }
    if (
      bookingParams?.flights?.length &&
      bookingParams?.flights?.every((flight) => !flight.selectedFlight)
    ) {
      navigate(CREATE_FLIGHT_SEARCH_PATH);
    }
    // TODO: redirect to hotel search page if hotel is not selected
  }, [bookingParams, navigate]);

  if (!bookingParams) return <Spin />;

  return (
    <Layout withSidebar={false}>
      <Form form={form} layout="horizontal" onFinish={handleSubmitForApproval}>
        <Row>
          <Col flex="300px" className="pr-8">
            <Button
              className="mt-10"
              color="primary"
              variant="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(CREATE_FLIGHT_SEARCH_PATH)}
            >
              Back
            </Button>
          </Col>
          <Col flex="auto">
            <div className="text-lg font-bold">Booking Confirmation</div>
            <div className="mt-4">
              {bookingParams.flights?.map((flight, index) => {
                return (
                  <div key={flight.name}>
                    <div className="text-lg font-medium">{flight.name}</div>
                    <FlightConfirmSection
                      index={index}
                      flight={flight.selectedFlight as FlightSearchOneWayType}
                    />
                    <Divider />
                  </div>
                );
              })}
              {/* TODO: add hotel confirmation section */}
            </div>
            <Row justify="end">
              <Col>
                <Button type="primary" htmlType="submit">
                  Submit for Approval
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
}

export default BookingConfirmView;
