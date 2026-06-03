import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tooltip } from 'antd';
import { useMemo, useState } from 'react';

import Layout from '@/components/Layout';
import SectionCard from '@/components/SectionCard';
import useDebouncedValue from '@/hooks/useDebouncedValue';

import ReportHotelFilterForm from './components/ReportHotelFilterForm';
import ReportHotelTable from './components/ReportHotelTable';
import useReportHotel from './hooks/useReportHotel';
import type { ReportHotelFilters } from './types';

export default function ReportHotelView() {
  const [filters, setFilters] = useState<ReportHotelFilters>({
    bookingCode: undefined,
  });

  const debouncedBookingCode = useDebouncedValue(filters.bookingCode, 400);

  const filtersValues = useMemo(
    () => ({
      bookingCode: debouncedBookingCode?.trim() || undefined,
      checkInDateRange: filters.checkInDateRange,
      checkOutDateRange: filters.checkOutDateRange,
      status: filters.status || undefined,
    }),
    [debouncedBookingCode, filters],
  );

  const {
    data,
    isLoading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    refresh,
    exportReportHotels,
    isExporting,
  } = useReportHotel(filtersValues);

  const handleExport = async () => {
    const csvText = await exportReportHotels();
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-hotel-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Layout>
      <SectionCard className="mt-4" title="Report Hotel">
        <Card size="small" className="mb-4">
          <Row justify="space-between">
            <Col>
              <ReportHotelFilterForm value={filters} onChange={setFilters} />
            </Col>
            <Col>
              <Space>
                <Tooltip title="Export">
                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    loading={isExporting}
                    aria-label="Export"
                  />
                </Tooltip>
                <Tooltip title="Refresh">
                  <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={refresh}
                    aria-label="Refresh balance"
                  />
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Card>
        <ReportHotelTable
          data={data}
          isLoading={isLoading}
          error={error ?? null}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </SectionCard>
    </Layout>
  );
}
