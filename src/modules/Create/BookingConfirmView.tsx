import { ArrowLeftOutlined } from '@ant-design/icons';
import { useIsFetching } from '@tanstack/react-query';
import { Button, Col, Divider, Form, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { FLIGHT_ADD_ONS } from '@/constants/queryKey';
import { CREATE_FLIGHT_SEARCH_PATH, CREATE_PATH } from '@/constants/routePath';
import type { FlightSearchOneWayType } from '@/types';

import FlightConfirm from './components/FlightConfirm';
import useBookingConfirm from './hooks/useBookingConfirm';

function BookingConfirmView() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { handleSubmitForApproval, bookingParams, isLoading } = useBookingConfirm();
  const isFetchingAddOns = useIsFetching({ queryKey: [FLIGHT_ADD_ONS] }) > 0;

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
        <Button
          className="mb-4"
          color="primary"
          variant="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(CREATE_FLIGHT_SEARCH_PATH)}
        >
          Back
        </Button>
        <div className="text-lg font-bold">Booking Confirmation</div>
        <div className="mt-4">
          {bookingParams.flights?.map((flight, index) => {
            return (
              <div key={flight.name}>
                <div className="text-lg font-medium">{flight.name}</div>
                <FlightConfirm
                  form={form}
                  index={index}
                  flight={flight.selectedFlight as FlightSearchOneWayType}
                  bookingParams={bookingParams}
                />
                <Divider />
              </div>
            );
          })}
          {/* TODO: add hotel confirmation section */}
        </div>
        <Row justify="end">
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isFetchingAddOns}
              loading={isLoading}
            >
              Submit for Approval
            </Button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
}

export default BookingConfirmView;
