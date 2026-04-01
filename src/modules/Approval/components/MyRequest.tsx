import { Alert, Button, Card, Col, List, Row, Space, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { APPROVAL_PATH } from '@/constants/routePath';

import useBookingMyRequest from '../hooks/useBookingMyRequest';
import BookingSummary from './BookingSummary';

function MyRequest({ onChangeTab }: { onChangeTab: (key: string) => void }) {
  const { data, isLoading, error } = useBookingMyRequest();
  const navigate = useNavigate();

  return (
    <Card
      className="mt-4"
      title={
        <Space>
          <Button
            variant="link"
            size="large"
            color="default"
            onClick={() => onChangeTab('need-approval')}
          >
            Need Approval
          </Button>
          <Button variant="link" size="large" color="primary">
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
            return (
              <List.Item style={{ paddingBlock: 24 }}>
                <div style={{ width: '100%' }}>
                  <BookingSummary data={item} />
                  <Row gutter={[16, 8]} style={{ width: '100%' }} className="mt-2">
                    <Col>
                      <Button
                        type="link"
                        onClick={() =>
                          navigate(`${APPROVAL_PATH}/${item.id}`, {
                            state: { booking: item, fromTab: 'my-request' },
                          })
                        }
                      >
                        View detail
                      </Button>
                    </Col>
                  </Row>
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
}
export default MyRequest;
