import { Card, Col, Row } from 'antd';
import { useState } from 'react';

import SectionCard from '@/components/SectionCard';
import { DEPOSIT_CODE_FLIGHT, DEPOSIT_CODE_HOTEL } from '@/constants/common';
import type { DepositCodeType } from '@/types';

import useDepositTransactions from '../hooks/useDepositTransactions';
import DepositTransactionTable from './DepositTransactionTable';

function DepositTransactions() {
  const [activeTab, setActiveTab] = useState<'flight' | 'hotel'>('flight');
  const flightTransactions = useDepositTransactions(DEPOSIT_CODE_FLIGHT as DepositCodeType);
  const hotelTransactions = useDepositTransactions(DEPOSIT_CODE_HOTEL as DepositCodeType);

  const flightTotal =
    flightTransactions.data?.totalElements ?? flightTransactions.data?.data?.length ?? 0;
  const hotelTotal =
    hotelTransactions.data?.totalElements ?? hotelTransactions.data?.data?.length ?? 0;

  const activeData = activeTab === 'flight' ? flightTransactions : hotelTransactions;

  return (
    <SectionCard className="mt-4" title="Transaction History">
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} md={12}>
          <Card
            className={`cursor-pointer ${
              activeTab === 'flight'
                ? 'border-flight bg-flight/10 shadow-sm'
                : 'border-flight/40 bg-transparent'
            }`}
            onClick={() => setActiveTab('flight')}
          >
            <div className="text-sm text-gray-500">Flight</div>
            <div className="text-2xl font-semibold">{flightTotal}</div>
            <div className="text-xs text-gray-400">Total transactions</div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            className={`cursor-pointer ${
              activeTab === 'hotel'
                ? 'border-hotel bg-hotel/10 shadow-sm'
                : 'border-hotel/40 bg-transparent'
            }`}
            onClick={() => setActiveTab('hotel')}
          >
            <div className="text-sm text-gray-500">Hotel</div>
            <div className="text-2xl font-semibold">{hotelTotal}</div>
            <div className="text-xs text-gray-400">Total transactions</div>
          </Card>
        </Col>
      </Row>
      <DepositTransactionTable
        data={activeData.data}
        isLoading={activeData.isLoading}
        error={activeData.error ?? null}
        page={activeData.page}
        pageSize={activeData.pageSize}
        setPage={activeData.setPage}
        setPageSize={activeData.setPageSize}
        refreshDepositTransactions={activeData.refreshDepositTransactions}
      />
    </SectionCard>
  );
}

export default DepositTransactions;
