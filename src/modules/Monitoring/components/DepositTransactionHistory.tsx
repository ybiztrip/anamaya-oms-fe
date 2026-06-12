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
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [referenceCode, setReferenceCode] = useState('');
  const [booker, setBooker] = useState('');
  const debouncedReferenceCode = useDebouncedValue(referenceCode, 400);
  const debouncedBooker = useDebouncedValue(booker, 400);
  const filters = useMemo(
    () => ({
      startDate: dateRange ? dateRange[0].format('YYYY-MM-DD') : undefined,
      endDate: dateRange ? dateRange[1].format('YYYY-MM-DD') : undefined,
      referenceCode: debouncedReferenceCode.trim() || undefined,
      booker: debouncedBooker.trim() || undefined,
    }),
    [dateRange, debouncedReferenceCode, debouncedBooker],
  );
  const flightSummary = useDepositTransactions(DEPOSIT_CODE_FLIGHT as DepositCodeType);
  const hotelSummary = useDepositTransactions(DEPOSIT_CODE_HOTEL as DepositCodeType);
  const flightTransactions = useDepositTransactions(
    DEPOSIT_CODE_FLIGHT as DepositCodeType,
    activeTab === 'flight' ? filters : undefined,
  );
  const hotelTransactions = useDepositTransactions(
    DEPOSIT_CODE_HOTEL as DepositCodeType,
    activeTab === 'hotel' ? filters : undefined,
  );

  const flightTotal =
    flightSummary.data?.totalElements ?? flightSummary.data?.data?.length ?? 0;
  const hotelTotal =
    hotelSummary.data?.totalElements ?? hotelSummary.data?.data?.length ?? 0;

  const activeData = activeTab === 'flight' ? flightTransactions : hotelTransactions;

  const handleTabChange = (tab: 'flight' | 'hotel') => {
    setActiveTab(tab);
    setDateRange(null);
    setReferenceCode('');
    setBooker('');
    if (tab === 'flight') {
      flightTransactions.setPage(1);
    } else {
      hotelTransactions.setPage(1);
    }
  };

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
            onClick={() => handleTabChange('flight')}
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
            onClick={() => handleTabChange('hotel')}
          >
            <div className="text-sm text-gray-500">Hotel</div>
            <div className="text-2xl font-semibold">{hotelTotal}</div>
            <div className="text-xs text-gray-400">Total transactions</div>
          </Card>
        </Col>
      </Row>
      <Card size="small" className="mb-4">
        <Row justify="space-between">
          <Col>
            <Row gutter={[16, 16]} className="mb-4">
              <Col xs={24} md={8}>
                <DatePicker.RangePicker
                  className="w-full"
                  value={dateRange}
                  onChange={(range) =>
                    setDateRange(range?.[0] && range?.[1] ? [range[0], range[1]] : null)
                  }
                  placeholder={['Start Date', 'End Date']}
                  allowClear
                />
              </Col>
              <Col xs={24} md={8}>
                <Input
                  placeholder="Reference Code"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                />
              </Col>
              <Col xs={24} md={8}>
                <Input
                  placeholder="Booker"
                  value={booker}
                  onChange={(e) => setBooker(e.target.value)}
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
