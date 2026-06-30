import { Alert, Button, Card, Checkbox, Col, List, Row, Space, Spin, Typography } from 'antd';

import SectionCard from '@/components/SectionCard';
import { BOOKING_STATUS_BOOKED, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { APPROVAL_PATH } from '@/constants/routePath';
import type { BookingApprovePayloadType, BookingType } from '@/types';
import { getBookingOverallStatus } from '@/utils/booking';

import useBookingApprove from '../hooks/useBookingApprove';
import useBookingNeedApproval from '../hooks/useBookingNeedApproval';
import BookingSummary from './BookingSummary';

const { Text } = Typography;

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NeedApproval({ onChangeTab }: { onChangeTab: (key: string) => void }) {
  const { items, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useBookingNeedApproval();
  const { approveBooking, rejectBooking, isLoading: isActionLoading } = useBookingApprove();
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [selectedBookings, setSelectedBookings] = useState<BookingType[]>([]);

  const allPendingBookings = useMemo(
    () => items?.filter((x) => getBookingOverallStatus(x).status === BOOKING_STATUS_BOOKED) ?? [],
    [items],
  );

  const selectedPendingBookings = useMemo(
    () =>
      selectedBookings.filter((booking) => {
        const currentBooking = items?.find((item) => item.id === booking.id);
        return currentBooking
          ? getBookingOverallStatus(currentBooking).status === BOOKING_STATUS_BOOKED
          : false;
      }),
    [selectedBookings, items],
  );

  const toggleOne = (booking: BookingType, checked: boolean) => {
    setSelectedBookings((prev) => {
      if (!checked) return prev.filter((item) => item.id !== booking.id);
      if (prev.some((item) => item.id === booking.id)) return prev;
      return [...prev, booking];
    });
  };

  const toggleAllPending = (checked: boolean) => {
    setSelectedBookings((prev) => {
      if (!checked) return prev.filter((item) => !allPendingBookings.some((b) => b.id === item.id));
      const merged = [...prev];
      allPendingBookings.forEach((booking) => {
        if (!merged.some((item) => item.id === booking.id)) {
          merged.push(booking);
        }
      });
      return merged;
    });
  };

  const buildPayload = (booking: BookingType): BookingApprovePayloadType => {
    const flightIds = (booking.flights ?? [])
      .filter((flight) => flight.status === BOOKING_STATUS_BOOKED && flight.id)
      .map((flight) => Number(flight.id))
      .filter((id) => !Number.isNaN(id));
    const hotelIds = (booking.hotels ?? [])
      .filter((hotel) => hotel.status === BOOKING_STATUS_BOOKED && hotel.id)
      .map((hotel) => Number(hotel.id))
      .filter((id) => !Number.isNaN(id));

    return { flightIds, hotelIds };
  };

  const approve = async (bookings: BookingType[]) => {
    await Promise.all(
      bookings.map((booking) =>
        approveBooking({ id: String(booking.id), payload: buildPayload(booking) }),
      ),
    );
    setSelectedBookings((prev) => prev.filter((item) => !bookings.some((b) => b.id === item.id)));
  };

  const reject = async (bookings: BookingType[]) => {
    await Promise.all(
      bookings.map((booking) =>
        rejectBooking({ id: String(booking.id), payload: buildPayload(booking) }),
      ),
    );
    setSelectedBookings((prev) => prev.filter((item) => !bookings.some((b) => b.id === item.id)));
  };

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
    <SectionCard
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
    >
      <Card size="small" className="mt-[-8px]">
        <Row justify="space-between">
          <Col>
            <Checkbox
              indeterminate={
                selectedPendingBookings.length > 0 &&
                selectedPendingBookings.length < allPendingBookings.length
              }
              checked={
                allPendingBookings.length > 0 &&
                selectedPendingBookings.length === allPendingBookings.length
              }
              onChange={(e) => toggleAllPending(e.target.checked)}
            >
              Select all
            </Checkbox>
          </Col>
          <Col>
            <Space>
              <Text type="secondary">Selected: {selectedPendingBookings.length}</Text>
              <Button
                type="primary"
                disabled={selectedPendingBookings.length === 0 || isActionLoading}
                loading={isActionLoading}
                onClick={() => approve(selectedPendingBookings)}
              >
                Approve selected
              </Button>

              <Button
                danger
                disabled={selectedPendingBookings.length === 0 || isActionLoading}
                loading={isActionLoading}
                onClick={() => reject(selectedPendingBookings)}
              >
                Reject selected
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
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
            const checked = selectedBookings.some((booking) => booking.id === item.id);
            return (
              <List.Item style={{ paddingBlock: 24 }}>
                <div className="w-full min-w-0 overflow-x-auto">
                  <Row
                    gutter={[16, 8]}
                    align="top"
                    wrap={false}
                    className="min-w-0"
                    style={{ width: '100%' }}
                  >
                    <Col flex="none" className="shrink-0 pt-0.5" style={{ width: 32 }}>
                      <Checkbox
                        checked={checked}
                        disabled={getBookingOverallStatus(item).status !== BOOKING_STATUS_BOOKED}
                        onChange={(e) => toggleOne(item, e.target.checked)}
                      />
                    </Col>

                    <Col flex="1 1 0%" style={{ minWidth: 0 }}>
                      <BookingSummary data={item} />
                      <Row gutter={[16, 8]} justify="space-between" className="mt-2">
                        <Col>
                          <Button
                            type="link"
                            onClick={() =>
                              navigate(`${APPROVAL_PATH}/${item.id}`, {
                                state: { booking: item, fromTab: 'need-approval' },
                              })
                            }
                          >
                            View detail
                          </Button>
                        </Col>
                        <Col>
                          <Space>
                            <Button
                              type="link"
                              danger
                              loading={isActionLoading}
                              onClick={() => reject([item])}
                            >
                              Reject
                            </Button>
                            <Button
                              type="primary"
                              loading={isActionLoading}
                              onClick={() => approve([item])}
                            >
                              Approve
                            </Button>
                          </Space>
                        </Col>
                      </Row>
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
    </SectionCard>
  );
}
export default NeedApproval;
