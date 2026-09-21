import { Button, Form, Row } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import {
  BOOKING_TYPE_FLIGHT,
  BOOKING_TYPE_FLIGHT_HOTEL,
  BOOKING_TYPE_HOTEL,
  BOOKING_TYPE_TRAIN,
  FLIGHT_CLASS_ECONOMY,
  TRAIN_CLASS_ECONOMY,
} from '@/constants/common';
import {
  CREATE_FLIGHT_SEARCH_PATH,
  CREATE_HOTEL_SEARCH_PATH,
  CREATE_TRAIN_SEARCH_PATH,
} from '@/constants/routePath';
import { BOOKING_PARAMS, USER } from '@/constants/storageKey';
import type { BookingParamsType, BookingTypeType, UserType } from '@/types';
import { localStorageGet } from '@/utils/localStorage';
import { sessionStorageGet, sessionStorageSet } from '@/utils/sessionStorage';

import FlightForm from './components/FlightForm';
import FlightHotelForm from './components/FlightHotelForm';
import HotelForm from './components/HotelForm';
import PassengerGuestForm from './components/PassengerGuestForm';
import TrainForm from './components/TrainForm';
import {
  flightFormToBookingParams,
  flightHotelFormToBookingParams,
  hotelFormToBookingParams,
  trainFormToBookingParams,
} from './utils/bookingFormMapper';

function CreateView() {
  const navigate = useNavigate();
  const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);
  const initialType = useMemo(() => {
    if (bookingParams?.hotel && bookingParams?.flights?.length) return BOOKING_TYPE_FLIGHT_HOTEL;
    if (bookingParams?.hotel) return BOOKING_TYPE_HOTEL;
    if (bookingParams?.train) return BOOKING_TYPE_TRAIN;
    return BOOKING_TYPE_FLIGHT;
  }, [bookingParams]);

  const [activeType, setActiveType] = useState<BookingTypeType>(initialType);
  const userProfile = localStorageGet<UserType>(USER);

  const handleTypeChange = (key: BookingTypeType) => {
    form.resetFields();
    setActiveType(key);
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    if (activeType === BOOKING_TYPE_FLIGHT) {
      const bookingParams = flightFormToBookingParams(values);
      sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, bookingParams);
      navigate(CREATE_FLIGHT_SEARCH_PATH);
    } else if (activeType === BOOKING_TYPE_HOTEL) {
      const bookingParams = hotelFormToBookingParams(values);
      sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, bookingParams);
      navigate(CREATE_HOTEL_SEARCH_PATH);
    } else if (activeType === BOOKING_TYPE_FLIGHT_HOTEL) {
      const bookingParams = flightHotelFormToBookingParams(values);
      sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, bookingParams);
      navigate(CREATE_FLIGHT_SEARCH_PATH);
    } else if (activeType === BOOKING_TYPE_TRAIN) {
      const bookingParams = trainFormToBookingParams(values);
      sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, bookingParams);
      navigate(CREATE_TRAIN_SEARCH_PATH);
    }
  };

  return (
    <Layout>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          tripType: 'oneWay',
          bookerName: `${userProfile?.firstName} ${userProfile?.lastName}`,
          flightClass: FLIGHT_CLASS_ECONOMY,
          trainClass: TRAIN_CLASS_ECONOMY,
          hotelStars: ['5'],
          rooms: 1,
          passengers: [{}],
        }}
        onFinish={onFinish}
      >
        {activeType === BOOKING_TYPE_FLIGHT && (
          <>
            <FlightForm form={form} onTypeChange={handleTypeChange} />
            <PassengerGuestForm form={form} type={BOOKING_TYPE_FLIGHT} />
          </>
        )}
        {activeType === BOOKING_TYPE_HOTEL && (
          <>
            <HotelForm form={form} onTypeChange={handleTypeChange} />
            <PassengerGuestForm form={form} type={BOOKING_TYPE_HOTEL} />
          </>
        )}
        {activeType === BOOKING_TYPE_FLIGHT_HOTEL && (
          <>
            <FlightHotelForm form={form} onTypeChange={handleTypeChange} />
            <PassengerGuestForm form={form} type={BOOKING_TYPE_FLIGHT_HOTEL} />
          </>
        )}
        {activeType === BOOKING_TYPE_TRAIN && (
          <>
            <TrainForm form={form} onTypeChange={handleTypeChange} />
            <PassengerGuestForm form={form} type={BOOKING_TYPE_TRAIN} />
          </>
        )}
        <div className="sticky bottom-0 z-10 bg-white p-4 border-t mb-[-2rem] mx-[-2rem]">
          <Row justify="end">
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Row>
        </div>
      </Form>
    </Layout>
  );
}
export default CreateView;
