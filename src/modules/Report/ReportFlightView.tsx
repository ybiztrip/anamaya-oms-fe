import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tooltip } from 'antd';
import { useMemo, useState } from 'react';

import Layout from '@/components/Layout';
import SectionCard from '@/components/SectionCard';
import useDebouncedValue from '@/hooks/useDebouncedValue';

import ReportFlightFilterForm from './components/ReportFlightFilterForm';
import ReportFlightTable from './components/ReportFlightTable';
import useReportFlight from './hooks/useReportFlight';
import type { ReportFlightFilters } from './types';

export default function ReportFlightView() {
  const [filters, setFilters] = useState<ReportFlightFilters>({
    bookingCode: undefined,
  });

  const debouncedBookingCode = useDebouncedValue(filters.bookingCode, 400);

  const filtersValues = useMemo(
    () => ({
      bookingCode: debouncedBookingCode?.trim() || undefined,
    }),
    [debouncedBookingCode],
  );

  const { data, isLoading, error, page, pageSize, setPage, setPageSize, refresh } =
    useReportFlight(filtersValues);

  const handleExport = async () => {
    // TODO: export report flights
  };
  return (
    <Layout>
      <SectionCard className="mt-4" title="Report Flight">
        <Card size="small">
          <Row justify="space-between">
            <Col>
              <ReportFlightFilterForm value={filters} onChange={setFilters} />
            </Col>
            <Col>
              <Space>
                <Tooltip title="Export">
                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
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
        <ReportFlightTable
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
