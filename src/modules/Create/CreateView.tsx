import { Form } from 'antd';
import { useState } from 'react';

import Layout from '@/components/Layout';

import FlightFilterForm from './components/FlightFilterForm';
import FlightHotelFilterForm from './components/FlightHotelFilterForm';
import HotelFilterForm from './components/HotelFilterForm';
import PassengerForm from './components/PassengerGuestForm';

function CreateView() {
  const [activeType, setActiveType] = useState('flight');

  const handleTypeChange = (key: string) => {
    setActiveType(key);
  };

  const [form] = Form.useForm();

  return (
    <Layout>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          tripType: 'roundTrip',
          bookerName: 'John Due',
          flightClass: 'economy',
          hotelStars: '5',
          passengers: [{}],
        }}
      >
        {activeType === 'flight' && (
          <>
            <FlightFilterForm form={form} onTypeChange={handleTypeChange} />
            <PassengerForm type="flight" />
          </>
        )}
        {activeType === 'hotel' && (
          <>
            <HotelFilterForm form={form} onTypeChange={handleTypeChange} />
            <PassengerForm type="hotel" />
          </>
        )}
        {activeType === 'flight-hotel' && (
          <>
            <FlightHotelFilterForm form={form} onTypeChange={handleTypeChange} />
            <PassengerForm type="flight-hotel" />
          </>
        )}
      </Form>
    </Layout>
  );
}
export default CreateView;
