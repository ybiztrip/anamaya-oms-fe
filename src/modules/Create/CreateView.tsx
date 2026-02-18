import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import {
  CREATE_FLIGHT_HOTEL_SEARCH_PATH,
  CREATE_FLIGHT_SEARCH_PATH,
  CREATE_HOTEL_SEARCH_PATH,
} from '@/constants/routePath';
import {
  BOOKING_PARAMS,
  FLIGHT_HOTEL_SEARCH_PARAMS,
  HOTEL_SEARCH_PARAMS,
  USER,
} from '@/constants/storageKey';
import type { BookingParamsType, UserType } from '@/types';
import { localStorageGet } from '@/utils/localStorage';
import { sessionStorageSet } from '@/utils/sessionStorage';

import FlightForm from './components/FlightForm';
import FlightHotelFilterForm from './components/FlightHotelFilterForm';
import HotelFilterForm from './components/HotelFilterForm';
import PassengerForm from './components/PassengerGuestForm';
import { flightFormToBookingParams } from './utils/flightFormMapper';

function CreateView() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('flight');
  const userProfile = localStorageGet<UserType>(USER);

  const handleTypeChange = (key: string) => {
    setActiveType(key);
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    if (activeType === 'flight') {
      const bookingParams = flightFormToBookingParams(values);
      sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, bookingParams);
      navigate(CREATE_FLIGHT_SEARCH_PATH);
    } else if (activeType === 'hotel') {
      sessionStorageSet(HOTEL_SEARCH_PARAMS, values);
      navigate(CREATE_HOTEL_SEARCH_PATH);
    } else if (activeType === 'flight-hotel') {
      sessionStorageSet(FLIGHT_HOTEL_SEARCH_PARAMS, values);
      navigate(CREATE_FLIGHT_HOTEL_SEARCH_PATH);
    }
  };

  return (
    <Layout>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          tripType: 'roundTrip',
          bookerName: `${userProfile?.firstName} ${userProfile?.lastName}`,
          flightClass: 'ECONOMY',
          hotelStars: '5',
          passengers: [{}],
        }}
        onFinish={onFinish}
      >
        {activeType === 'flight' && (
          <>
            <FlightForm form={form} onTypeChange={handleTypeChange} />
            <PassengerForm form={form} type="flight" />
          </>
        )}
        {activeType === 'hotel' && (
          <>
            <HotelFilterForm form={form} onTypeChange={handleTypeChange} />
            <PassengerForm form={form} type="hotel" />
          </>
        )}
        {activeType === 'flight-hotel' && (
          <>
            <FlightHotelFilterForm form={form} onTypeChange={handleTypeChange} />
            <PassengerForm form={form} type="flight-hotel" />
          </>
        )}
        <Row justify="end">
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Row>
      </Form>
    </Layout>
  );
}
export default CreateView;
