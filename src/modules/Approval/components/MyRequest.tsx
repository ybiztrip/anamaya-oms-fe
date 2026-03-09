import { Alert, Button, Card, Col, List, Row, Space, Spin, Typography } from 'antd';

const { Text } = Typography;

import { BOOKING_STATUS_APPROVED, DEFAULT_ERROR_MESSAGE } from '@/constants/common';

import useBookingList from '../hooks/useBookingList';
import BookingSummary from './BookingSummary';

function MyRequest() {
  const { data, isLoading, error } = useBookingList({ status: BOOKING_STATUS_APPROVED });

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
      {isLoading && <Spin />}
      {error && <Alert message={error?.message ?? DEFAULT_ERROR_MESSAGE} type="error" />}
      <List
        dataSource={data}
        rowKey="id"
        renderItem={(item) => {
          return (
            <List.Item style={{ paddingBlock: 24 }}>
              <div style={{ width: '100%' }}>
                <BookingSummary data={item} />
                <Row gutter={[16, 8]} style={{ width: '100%' }} className="mt-2">
                  <Col>
                    <Button type="link">View detail</Button>
                  </Col>
                </Row>
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
export default MyRequest;
