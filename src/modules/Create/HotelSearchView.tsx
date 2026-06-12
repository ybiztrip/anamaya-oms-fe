import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import {
  CREATE_FLIGHT_SEARCH_PATH,
  CREATE_HOTEL_ROOM_PATH,
  CREATE_PATH,
} from '@/constants/routePath';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import type { BookingParamsType, HotelPropertyType } from '@/types';
import dayjs from '@/utils/dayjs';
import { sessionStorageGet, sessionStorageSet } from '@/utils/sessionStorage';

import HotelInfoSummary from './components/HotelInfoSummary';
import HotelSearchForm from './components/HotelSearchForm';

function HotelSearchView() {
  const navigate = useNavigate();

  const [bookingParams, setBookingParams] = useState<BookingParamsType | null>(() =>
    sessionStorageGet<BookingParamsType>(BOOKING_PARAMS),
  );

  const updateBookingParams = useCallback((newBookingParams: BookingParamsType) => {
    sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, newBookingParams);
    setBookingParams(newBookingParams);
  }, []);

  const syncSearchParams = useCallback(
    (formValues: any) => {
      const newHotel = {
        ...bookingParams?.hotel,
        destinationName: formValues.destination.label,
        destinationGeo: formValues.destination.value,
        checkInDate: formValues.checkInDate,
        checkOutDate: formValues.checkOutDate,
      };
      const newBookingParams = {
        ...bookingParams,
        hotel: newHotel,
      } as BookingParamsType;
      updateBookingParams(newBookingParams);
    },
    [bookingParams, updateBookingParams],
  );

  const selectHotel = useCallback(
    (hotel: HotelPropertyType, formValues: any) => {
      const newHotel = {
        ...bookingParams?.hotel,
        destinationName: formValues.destination.label,
        destinationGeo: formValues.destination.value,
        checkInDate: formValues.checkInDate,
        checkOutDate: formValues.checkOutDate,
        selectedHotel: hotel,
      };
      const newBookingParams = {
        ...bookingParams,
        hotel: newHotel,
      } as BookingParamsType;
      updateBookingParams(newBookingParams);
      navigate(CREATE_HOTEL_ROOM_PATH);
    },
    [bookingParams, updateBookingParams, navigate],
  );

  const handleBack = () => {
    if (bookingParams?.flights?.length) {
      navigate(CREATE_FLIGHT_SEARCH_PATH);
    } else {
      navigate(CREATE_PATH);
    }
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
            onClick={handleBack}
          >
            Back
          </Button>
        </Col>
        <Col flex="auto">
          <Button className="p-10" size="large" type="primary">
            <div className="text-center">
              <div className="flex items-center gap-2 text-center">
                <div className="font-semibold">Hotel</div>
                <div>{`(${dayjs(bookingParams?.hotel?.checkInDate).format('DD MMM YYYY')} - ${dayjs(bookingParams?.hotel?.checkOutDate).format('DD MMM YYYY')})`}</div>
              </div>
              <div className="mt-2">
                {bookingParams?.hotel?.selectedHotel && (
                  <HotelInfoSummary hotel={bookingParams.hotel?.selectedHotel} />
                )}
              </div>
            </div>
          </Button>
        </Col>
      </Row>
      {bookingParams && (
        <HotelSearchForm
          bookingParams={bookingParams}
          onSelectHotel={selectHotel}
          onSearchParamsChange={syncSearchParams}
        />
      )}
    </Layout>
  );
}
export default HotelSearchView;
