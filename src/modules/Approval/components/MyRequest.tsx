import { Button, Card, Col, List, Row, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;
import { useState } from 'react';

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

function MyRequest() {
  const [items] = useState<BookingItem[]>(MOCK);
  return (
    <Card
      className="mt-4"
      title={
        <Space>
          <Text type="secondary">My Request</Text>
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
          return (
            <List.Item style={{ paddingInline: 0 }}>
              <Row gutter={[16, 8]} align="top" style={{ width: '100%' }}>

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
export default MyRequest;
