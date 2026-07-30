import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tooltip } from 'antd';
import { useMemo, useState } from 'react';

import SectionCard from '@/components/SectionCard';

import useRefund from '../hooks/useRefund';
import type { RefundFilters } from '../types';
import RefundFilterForm from './RefundFilterForm';
import RefundTable from './RefundTable';

export default function RefundList({
  type,
  onTypeChange,
}: Readonly<{
  type: 'FLIGHT' | 'HOTEL';
  onTypeChange: (key: string) => void;
}>) {
  const [filters, setFilters] = useState<RefundFilters>({
    dateRange: undefined,
  });

  const filtersValues = useMemo(
    () => ({
      dateRange: filters.dateRange,
    }),
    [filters],
  );

  const { data, isLoading, error, page, pageSize, setPage, setPageSize, refresh } = useRefund({
    type,
    filters: filtersValues,
  });

  return (
    <SectionCard
      className="mt-4"
      title={
        <Space>
          <Button
            variant="link"
            size="large"
            color={type === 'FLIGHT' ? 'primary' : 'default'}
            onClick={() => onTypeChange('FLIGHT')}
          >
            Flight
          </Button>
          <Button
            variant="link"
            size="large"
            color={type === 'HOTEL' ? 'primary' : 'default'}
            onClick={() => onTypeChange('HOTEL')}
          >
            Hotel
          </Button>
        </Space>
      }
    >
      <Card size="small" className="mb-4">
        <Row justify="space-between">
          <Col>
            <RefundFilterForm value={filters} onChange={setFilters} />
          </Col>
          <Col>
            <Space>
              <Tooltip title="Refresh">
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={refresh}
                  aria-label="Refresh list"
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>
      <RefundTable
        data={data}
        isLoading={isLoading}
        error={error ?? null}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
      />
    </SectionCard>
  );
}
