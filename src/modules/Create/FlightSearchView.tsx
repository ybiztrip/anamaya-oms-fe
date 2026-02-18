import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { CREATE_BOOKING_CONFIRM_PATH, CREATE_PATH } from '@/constants/routePath';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import type { BookingParamsType, FlightSearchOneWayType } from '@/types';
import dayjs from '@/utils/dayjs';
import { sessionStorageGet, sessionStorageSet } from '@/utils/sessionStorage';

import FlightInfoSummary from './components/FlightInfoSummary';
import FlightSearchForm from './components/FlightSearchForm';

function FlightSearchView() {
  const navigate = useNavigate();

  const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);

  const selectFlight = (flight: FlightSearchOneWayType, flightIndex: number) => {
    const newFlights = [...(bookingParams?.flights ?? [])];
    newFlights[flightIndex] = {
      ...newFlights[flightIndex],
      origin: flight.departureAirport,
      destination: flight.arrivalAirport,
      departureDate: flight.journeys[0].departureDetail.departureDate,
      selectedFlight: flight,
    };
    const newBookingParams = {
      ...bookingParams,
      flights: newFlights,
    } as BookingParamsType;
    sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, newBookingParams);
    if (flightIndex === Number(bookingParams?.flights?.length ?? 0) - 1) {
      navigate(CREATE_BOOKING_CONFIRM_PATH);
    } else {
      setActiveFlightIndex(flightIndex + 1);
    }
  };

  const [activeFlightIndex, setActiveFlightIndex] = useState<number | null>(0);
  useEffect(() => {
    if (!bookingParams) {
      navigate(CREATE_PATH);
    }
  }, [bookingParams, navigate]);

  return (
    <Layout withSidebar={false}>
      <Row>
        <Col flex="300px" className="pr-8">
          <Button
            className="mt-1"
            color="primary"
            variant="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(CREATE_PATH)}
          >
            Back
          </Button>
        </Col>
        <Col flex="auto">
          <Space.Compact>
            {bookingParams?.flights?.map((flight, index) => {
              return (
                <Button
                  className="p-10"
                  key={flight.name}
                  size="large"
                  disabled={index > Number(activeFlightIndex)}
                  onClick={() => setActiveFlightIndex(index)}
                  type={activeFlightIndex === index ? 'primary' : 'default'}
                >
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-center">
                      <div className="font-semibold">{flight.name}</div>
                      <div>{`(${dayjs(flight?.departureDate).format('DD-MM-YYYY')})`}</div>
                    </div>
                    <div className="mt-2">
                      {flight.selectedFlight && (
                        <FlightInfoSummary flight={flight.selectedFlight} />
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </Space.Compact>
        </Col>
      </Row>
      {bookingParams?.flights?.map((flight, index) => {
        if (activeFlightIndex !== null && activeFlightIndex !== index) return null;
        return (
          <FlightSearchForm
            key={flight.name}
            bookingParams={bookingParams}
            flightIndex={index}
            onSelectFlight={selectFlight}
          />
        );
      })}
    </Layout>
  );
}
export default FlightSearchView;
