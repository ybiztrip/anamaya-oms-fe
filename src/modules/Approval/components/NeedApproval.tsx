import { Button, Card, Checkbox, Col, List, Row, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;
import { useMemo, useState } from 'react';

type BookingItem = {
  id: string;
  booker: string;
  passenger: string;
  origin: string;
  destination: string;
  departureDatetime: string;
  arrivalDatetime: string;
  createdAt: string;
  approvedAt: string;
  rejectedAt: string;
  status: 'BOOKED' | 'APPROVED' | 'REJECTED';
};

const MOCK: BookingItem[] = [
  {
    id: 'REQ-001',
    booker: 'John Doe',
    passenger: 'John Doe',
    origin: 'CGK',
    destination: 'DPS',
    departureDatetime: '2025-12-27T08:00:00',
    arrivalDatetime: '2025-12-27T11:00:00',
    createdAt: '2026-01-17T09:30:00',
    approvedAt: '',
    rejectedAt: '',
    status: 'BOOKED',
  },
  {
    id: 'REQ-002',
    booker: 'John Doe',
    passenger: 'Jane Doe',
    origin: 'CGK',
    destination: 'DPS',
    departureDatetime: '2025-12-27T08:00:00',
    arrivalDatetime: '2025-12-27T11:00:00',
    createdAt: '2026-01-16T11:20:00',
    approvedAt: '',
    rejectedAt: '',
    status: 'BOOKED',
  },
];

function NeedApproval() {
  const [items, setItems] = useState<BookingItem[]>(MOCK);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allPendingIds = useMemo(
    () => items.filter((x) => x.status === 'BOOKED').map((x) => x.id),
    [items],
  );

  const selectedPendingIds = useMemo(
    () => selectedIds.filter((id) => items.find((x) => x.id === id)?.status === 'BOOKED'),
    [selectedIds, items],
  );

  const toggleOne = (id: string, checked: boolean) => {
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

  const approve = (ids: string[]) => {
    setItems((prev) => prev.map((x) => (ids.includes(x.id) ? { ...x, status: 'APPROVED' } : x)));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const reject = (ids: string[]) => {
    setItems((prev) => prev.map((x) => (ids.includes(x.id) ? { ...x, status: 'REJECTED' } : x)));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
  };
  return (
    <Card
      className="mt-4"
      title={
        <Space>
          <Checkbox
            indeterminate={
              selectedPendingIds.length > 0 && selectedPendingIds.length < allPendingIds.length
            }
            checked={allPendingIds.length > 0 && selectedPendingIds.length === allPendingIds.length}
            onChange={(e) => toggleAllPending(e.target.checked)}
          >
            Select all pending
          </Checkbox>

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

          <Text type="secondary">Selected: {selectedPendingIds.length}</Text>
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
      <List
        dataSource={items}
        rowKey="id"
        renderItem={(item) => {
          const checked = selectedIds.includes(item.id);
          const isPending = item.status === 'BOOKED';

          return (
            <List.Item style={{ paddingInline: 0 }}>
              <Row gutter={[16, 8]} align="top" style={{ width: '100%' }}>
                <Col flex="32px">
                  <Checkbox
                    checked={checked}
                    disabled={!isPending}
                    onChange={(e) => toggleOne(item.id, e.target.checked)}
                  />
                </Col>

                <Col flex="auto">
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Text>
                      <Text type="secondary">Booker:</Text> {item.booker}
                    </Text>
                    <Text>
                      <Text type="secondary">Passenger:</Text> {item.passenger}
                    </Text>

                    <Text>
                      {dayjs(item.departureDatetime).format('ddd, MMM DD HH:mm')}{' '}
                      <Text strong>{item.origin}</Text>
                    </Text>
                    <Text>
                      {dayjs(item.arrivalDatetime).format('ddd, MMM DD HH:mm')}{' '}
                      <Text strong>{item.destination}</Text>
                    </Text>

                    <Button type="link">View detail</Button>
                  </Space>
                </Col>

                <Col flex="280px">
                  <Space direction="vertical" align="end" size={8} style={{ width: '100%' }}>
                    <Tag
                      color={
                        item.status === 'BOOKED'
                          ? 'blue'
                          : item.status === 'APPROVED'
                            ? 'green'
                            : 'red'
                      }
                    >
                      {item.status}
                    </Tag>

                    <Text type="secondary">
                      Created: {dayjs(item.createdAt).format('ddd, MMM DD HH:mm')}
                    </Text>

                    {isPending && (
                      <Space>
                        <Button type="link" danger onClick={() => reject([item.id])}>
                          Reject with reason
                        </Button>
                        <Button type="primary" onClick={() => approve([item.id])}>
                          Approve
                        </Button>
                      </Space>
                    )}
                  </Space>
                </Col>
              </Row>
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
export default NeedApproval;
