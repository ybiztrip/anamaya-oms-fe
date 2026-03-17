import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { CREATE_BOOKING_CONFIRM_PATH, CREATE_PATH } from '@/constants/routePath';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import type { BookingParamsType, HotelPropertyType } from '@/types';
import dayjs from '@/utils/dayjs';
import { sessionStorageGet, sessionStorageSet } from '@/utils/sessionStorage';

import HotelSearchForm from './components/HotelSearchForm';

function HotelSearchView() {
  const navigate = useNavigate();

  const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);

  const selectHotel = (hotel: HotelPropertyType, formValues: any) => {
    const newHotel = { 
      ...bookingParams?.hotel,
      destination: formValues.destination,
      checkInDate: dayjs(formValues.stayRange?.[0]).format('YYYY-MM-DD'),
      checkOutDate: dayjs(formValues.stayRange?.[1]).format('YYYY-MM-DD'),
      selectedHotel: hotel,
    };
    const newBookingParams = {
      ...bookingParams,
      hotel: newHotel,
    } as BookingParamsType;
    sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, newBookingParams);
    // TODO: open hotel rooms detail
  };

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
        <Col flex="auto"></Col>
      </Row>
      {bookingParams && (
        <HotelSearchForm bookingParams={bookingParams} onSelectHotel={selectHotel} />
      )}
    </Layout>
  );
}
export default HotelSearchView;
