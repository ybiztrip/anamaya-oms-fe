import { Alert, Button, Card, Col, List, Row, Space, Spin } from 'antd';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { APPROVAL_PATH } from '@/constants/routePath';

import useBookingMyApproval from '../hooks/useBookingMyApproval';
import BookingSummary from './BookingSummary';

function MyApproval({ onChangeTab }: { onChangeTab: (key: string) => void }) {
  const { items, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useBookingMyApproval();
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    if (!hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
          <Button
            variant="link"
            size="large"
            color="default"
            onClick={() => onChangeTab('my-request')}
          >
            My Request
          </Button>
          <Button variant="link" size="large" color="primary">
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
      {isLoading && items.length === 0 && (
        <div className="w-full text-center">
          <Spin />
        </div>
      )}
      {error && <Alert message={error?.message ?? DEFAULT_ERROR_MESSAGE} type="error" />}
      {!isLoading && !error && (
        <List
          dataSource={items}
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
                            state: { booking: item, fromTab: 'my-approval' },
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
          loadMore={
            items && items.length > 0 ? (
              <div className="flex justify-center py-4">
                {hasNextPage ? (
                  <>
                    {isFetchingNextPage && <Spin size="small" />}
                    <div ref={sentinelRef} style={{ height: 1 }} />
                  </>
                ) : (
                  <span className="text-xs text-gray-400">No more data</span>
                )}
              </div>
            ) : null
          }
        />
      )}
    </Card>
  );
}
export default MyApproval;
