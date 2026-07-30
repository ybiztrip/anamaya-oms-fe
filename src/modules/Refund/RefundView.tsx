import { useState } from 'react';

import Layout from '@/components/Layout';

import RefundList from './components/RefundList';

export default function RefundView() {
  const [activeType, setActiveType] = useState<string>('FLIGHT');

  const handleTypeChange = (key: string) => {
    setActiveType(key);
  };

  return (
    <Layout>
      {activeType === 'FLIGHT' && <RefundList type="FLIGHT" onTypeChange={handleTypeChange} />}
      {activeType === 'HOTEL' && <RefundList type="HOTEL" onTypeChange={handleTypeChange} />}
    </Layout>
  );
}
