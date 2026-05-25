import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Input, Row, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import SectionCard from '@/components/SectionCard';
import { DEPOSIT_CODE_FLIGHT, DEPOSIT_CODE_HOTEL } from '@/constants/common';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import type { DepositCodeType } from '@/types';

import useDepositTransactions from '../hooks/useDepositTransactions';
import DepositTransactionTable from './DepositTransactionTable';

function DepositTransactions() {
  const [activeTab, setActiveTab] = useState<'flight' | 'hotel'>('flight');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [referenceCode, setReferenceCode] = useState('');
  const debouncedReferenceCode = useDebouncedValue(referenceCode, 400);
  const filters = useMemo(
    () => ({
      createdAt: selectedDate ? selectedDate.format('YYYY-MM-DD') : undefined,
      referenceCode: debouncedReferenceCode.trim() || undefined,
    }),
    [selectedDate, debouncedReferenceCode],
  );
  const flightTransactions = useDepositTransactions(
    DEPOSIT_CODE_FLIGHT as DepositCodeType,
    filters,
  );
  const hotelTransactions = useDepositTransactions(DEPOSIT_CODE_HOTEL as DepositCodeType, filters);

  const flightTotal =
    flightTransactions.data?.totalElements ?? flightTransactions.data?.data?.length ?? 0;
  const hotelTotal =
    hotelTransactions.data?.totalElements ?? hotelTransactions.data?.data?.length ?? 0;

  const activeData = activeTab === 'flight' ? flightTransactions : hotelTransactions;

  const handleExport = async () => {
    const csvText = await activeData.exportDepositTransactions();
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deposit-monitoring-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
      <Card size="small">
        <Row justify="space-between">
          <Col>
            <Row gutter={[16, 16]} className="mb-4">
              <Col xs={24} md={12}>
                <DatePicker
                  className="w-full"
                  onChange={(value) => setSelectedDate(value)}
                  placeholder="Transaction Date"
                  allowClear
                />
              </Col>
              <Col xs={24} md={12}>
                <Input
                  placeholder="Reference Code"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Space>
              <Tooltip title="Export">
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  loading={activeData.isExporting}
                  aria-label="Export"
                />
              </Tooltip>
              <Tooltip title="Refresh">
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={activeData.refreshDepositTransactions}
                  aria-label="Refresh balance"
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>
      <DepositTransactionTable
        data={activeData.data}
        isLoading={activeData.isLoading}
        error={activeData.error ?? null}
        page={activeData.page}
        pageSize={activeData.pageSize}
        setPage={activeData.setPage}
        setPageSize={activeData.setPageSize}
        refreshData={activeData.refreshDepositTransactions}
      />
    </SectionCard>
  );
}

export default DepositTransactions;
