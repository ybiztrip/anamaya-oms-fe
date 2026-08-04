import { useState } from 'react';

import Layout from '@/components/Layout';
import { BOOKING_TYPE_FLIGHT, BOOKING_TYPE_HOTEL } from '@/constants/common';
import type { BookingTypeType } from '@/types';

import RefundList from './components/RefundList';

export default function RefundView() {
  const [activeType, setActiveType] = useState<BookingTypeType>(BOOKING_TYPE_FLIGHT);

  const handleTypeChange = (key: BookingTypeType) => {
    setActiveType(key);
  };

  return (
    <Layout>
      {activeType === BOOKING_TYPE_FLIGHT && (
        <RefundList type={BOOKING_TYPE_FLIGHT} onTypeChange={handleTypeChange} />
      )}
      {activeType === BOOKING_TYPE_HOTEL && (
        <RefundList type={BOOKING_TYPE_HOTEL} onTypeChange={handleTypeChange} />
      )}
    </Layout>
  );
}
