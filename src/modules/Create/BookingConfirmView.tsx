import { ArrowLeftOutlined } from '@ant-design/icons';
import { useIsFetching } from '@tanstack/react-query';
import { Button, Col, Divider, Form, Row, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { FLIGHT_ADD_ONS } from '@/constants/queryKey';
import {
  CREATE_FLIGHT_SEARCH_PATH,
  CREATE_HOTEL_SEARCH_PATH,
  CREATE_PATH,
} from '@/constants/routePath';
import type {
  BookingPriceItemType,
  FlightSearchOneWayType,
  HotelPropertyType,
  HotelRoomRateType,
} from '@/types';

import FlightConfirm from './components/FlightConfirm';
import HotelConfirm from './components/HotelConfirm';
import PriceDetail from './components/PriceDetail';
import useBookingConfirm from './hooks/useBookingConfirm';

function BookingConfirmView() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { handleSubmitForApproval, bookingParams, isLoading } = useBookingConfirm();
  const isFetchingAddOns = useIsFetching({ queryKey: [FLIGHT_ADD_ONS] }) > 0;
  const [flightPrices, setFlightPrices] = useState<Record<number, BookingPriceItemType[]>>({});
  const [hotelPrices, setHotelPrices] = useState<BookingPriceItemType[]>([]);

  const handleBack = useCallback(() => {
    if (bookingParams?.flights?.length) {
      navigate(CREATE_FLIGHT_SEARCH_PATH);
    } else if (bookingParams?.hotel) {
      navigate(CREATE_HOTEL_SEARCH_PATH);
    } else {
      navigate(CREATE_PATH);
    }
  }, [bookingParams?.flights?.length, bookingParams?.hotel, navigate]);

  const handleFlightPrices = useCallback((prices: BookingPriceItemType[], flightIndex: number) => {
    setFlightPrices((prev) => ({ ...prev, [flightIndex]: prices }));
  }, []);

  const handleHotelPrices = useCallback((prices: BookingPriceItemType[]) => {
    setHotelPrices(prices);
  }, []);

  const allPrices = useMemo(() => {
    return [...Object.values(flightPrices).flat(), ...hotelPrices];
  }, [flightPrices, hotelPrices]);

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
          onClick={handleBack}
        >
          Back
        </Button>
        <div className="text-lg font-bold">Booking Confirmation</div>
        <Row gutter={[16, 8]} className="mt-4" wrap={false}>
          <Col flex="auto">
            <div className="overflow-x-auto">
              <div style={{ minWidth: 500 }}>
                {bookingParams.flights?.map((flight, index) => {
                  return (
                    <div key={flight.name}>
                      <div className="text-lg font-medium">{flight.name}</div>
                      <FlightConfirm
                        form={form}
                        index={index}
                        flight={flight.selectedFlight as FlightSearchOneWayType}
                        bookingParams={bookingParams}
                        onPriceListChange={handleFlightPrices}
                      />
                      <Divider />
                    </div>
                  );
                })}

                {bookingParams.hotel && (
                  <>
                    <div className="text-lg font-medium">Hotel</div>
                    <HotelConfirm
                      hotel={bookingParams.hotel.selectedHotel as HotelPropertyType}
                      room={bookingParams.hotel.selectedRoom as HotelRoomRateType}
                      bookingParams={bookingParams}
                      onPriceListChange={handleHotelPrices}
                    />
                  </>
                )}
              </div>
            </div>
          </Col>
          <Col flex="400px">
            <PriceDetail prices={allPrices} />
          </Col>
        </Row>
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
