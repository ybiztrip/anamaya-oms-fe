import { Alert, Button, Card, Checkbox, Col, List, Row, Space, Spin, Typography } from 'antd';

import { BOOKING_STATUS_BOOKED, DEFAULT_ERROR_MESSAGE } from '@/constants/common';

import useBookingNeedApproval from '../hooks/useBookingNeedApproval';
import BookingSummary from './BookingSummary';

const { Text } = Typography;

import { useMemo, useState } from 'react';

function NeedApproval({ onChangeTab }: { onChangeTab: (key: string) => void }) {
  const { data, isLoading, error } = useBookingNeedApproval();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allPendingIds = useMemo(
    () => data?.filter((x) => x.status === BOOKING_STATUS_BOOKED).map((x) => x.id) ?? [],
    [data],
  );

  const selectedPendingIds = useMemo(
    () =>
      selectedIds.filter((id) => data?.find((x) => x.id === id)?.status === BOOKING_STATUS_BOOKED),
    [selectedIds, data],
  );

  const toggleOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id),
    );
  };

  const toggleAllPending = (checked: boolean) => {
    setSelectedIds((prev) => {
      if (!checked) return prev.filter((id) => !allPendingIds.includes(id));
      return Array.from(new Set([...prev, ...allPendingIds]));
    });
  };

  const approve = (ids: number[]) => {
    // TODO: approve bookings
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const reject = (ids: number[]) => {
    // TODO: reject bookings
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
  };
  return (
    <Card
      className="mt-4"
      title={
        <Space>
          <Button variant="link" size="large" color="primary">
            Need Approval
          </Button>
          <Button
            variant="link"
            size="large"
            color="default"
            onClick={() => onChangeTab('my-request')}
          >
            My Request
          </Button>
          <Button
            variant="link"
            size="large"
            color="default"
            onClick={() => onChangeTab('my-approval')}
          >
            My Approval
          </Button>
        </Space>
      }
      style={{
        border: 'none',
        boxShadow: 'none',
      }}
      styles={{
        header: {
          margin: '0 auto -24px auto',
          width: 'fit-content',
          borderRadius: 24,
          border: '1px #8BB9FF solid',
          backgroundColor: 'white',
          zIndex: 10,
          position: 'relative',
        },
        body: {
          border: '1px #8BB9FF solid',
          borderRadius: 24,
          paddingTop: 40,
          backgroundColor: '#fff',
          zIndex: 1,
          position: 'relative',
        },
      }}
    >
      <Card size="small" className="mt-[-8px]">
        <Row justify="space-between">
          <Col>
            <Checkbox
              indeterminate={
                selectedPendingIds.length > 0 && selectedPendingIds.length < allPendingIds.length
              }
              checked={
                allPendingIds.length > 0 && selectedPendingIds.length === allPendingIds.length
              }
              onChange={(e) => toggleAllPending(e.target.checked)}
            >
              Select all
            </Checkbox>
          </Col>
          <Col>
            <Space>
              <Text type="secondary">Selected: {selectedPendingIds.length}</Text>
              <Button
                type="primary"
                disabled={selectedPendingIds.length === 0}
                onClick={() => approve(selectedPendingIds)}
              >
                Approve selected
              </Button>

              <Button
                danger
                disabled={selectedPendingIds.length === 0}
                onClick={() => reject(selectedPendingIds)}
              >
                Reject selected
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      {isLoading && (
        <div className="w-full text-center">
          <Spin />
        </div>
      )}
      {error && <Alert message={error?.message ?? DEFAULT_ERROR_MESSAGE} type="error" />}
      {!isLoading && !error && (
        <List
          dataSource={data}
          rowKey="id"
          renderItem={(item) => {
            const checked = selectedIds.includes(item.id);
            return (
              <List.Item style={{ paddingBlock: 24 }}>
                <Row gutter={[16, 8]} align="top" style={{ width: '100%' }}>
                  <Col flex="32px">
                    <Checkbox
                      checked={checked}
                      disabled={item.status !== BOOKING_STATUS_BOOKED}
                      onChange={(e) => toggleOne(item.id, e.target.checked)}
                    />
                  </Col>

                  <Col flex="auto">
                    <BookingSummary data={item} />
                    <Row gutter={[16, 8]} justify="space-between" className="mt-2">
                      <Col>
                        <Button type="link">View detail</Button>
                      </Col>
                      <Col>
                        <Space>
                          <Button type="link" danger onClick={() => reject([item.id])}>
                            Reject
                          </Button>
                          <Button type="primary" onClick={() => approve([item.id])}>
                            Approve
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
}
export default NeedApproval;
