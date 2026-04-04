import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { CREATE_FLIGHT_SEARCH_PATH, CREATE_HOTEL_SEARCH_PATH } from '@/constants/routePath';
import { BOOKING_PARAMS, USER } from '@/constants/storageKey';
import type { BookingParamsType, UserType } from '@/types';
import { localStorageGet } from '@/utils/localStorage';
import { sessionStorageGet, sessionStorageSet } from '@/utils/sessionStorage';

import FlightForm from './components/FlightForm';
import FlightHotelForm from './components/FlightHotelForm';
import HotelForm from './components/HotelForm';
import PassengerGuestForm from './components/PassengerGuestForm';
import {
  flightFormToBookingParams,
  flightHotelFormToBookingParams,
  hotelFormToBookingParams,
} from './utils/bookingFormMapper';

function CreateView() {
  const navigate = useNavigate();
  const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);
  const initialType = bookingParams?.hotel
    ? bookingParams?.flights?.length
      ? 'flight-hotel'
      : 'hotel'
    : 'flight';
  const [activeType, setActiveType] = useState(initialType);
  const userProfile = localStorageGet<UserType>(USER);

  const handleTypeChange = (key: string) => {
    form.resetFields();
    setActiveType(key);
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    if (activeType === 'flight') {
      const bookingParams = flightFormToBookingParams(values);
      sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, bookingParams);
      navigate(CREATE_FLIGHT_SEARCH_PATH);
    } else if (activeType === 'hotel') {
      const bookingParams = hotelFormToBookingParams(values);
      sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, bookingParams);
      navigate(CREATE_HOTEL_SEARCH_PATH);
    } else if (activeType === 'flight-hotel') {
      const bookingParams = flightHotelFormToBookingParams(values);
      sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, bookingParams);
      navigate(CREATE_FLIGHT_SEARCH_PATH);
    }
  };

  return (
    <Layout>
      <Form
        form={form}
        layout="horizontal"
        initialValues={{
          tripType: 'oneWay',
          bookerName: `${userProfile?.firstName} ${userProfile?.lastName}`,
          flightClass: 'ECONOMY',
          hotelStars: ['5'],
          rooms: 1,
          passengers: [{}],
        }}
        onFinish={onFinish}
      >
        {activeType === 'flight' && (
          <>
            <FlightForm form={form} onTypeChange={handleTypeChange} />
            <PassengerGuestForm form={form} type="flight" />
          </>
        )}
        {activeType === 'hotel' && (
          <>
            <HotelForm form={form} onTypeChange={handleTypeChange} />
            <PassengerGuestForm form={form} type="hotel" />
          </>
        )}
        {activeType === 'flight-hotel' && (
          <>
            <FlightHotelForm form={form} onTypeChange={handleTypeChange} />
            <PassengerGuestForm form={form} type="flight-hotel" />
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
