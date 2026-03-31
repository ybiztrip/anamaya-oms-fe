import { Alert, Button, Card, Checkbox, Col, List, Row, Space, Spin, Typography } from 'antd';

import { BOOKING_STATUS_BOOKED, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { BookingApprovePayloadType, BookingType } from '@/types';

import useBookingApprove from '../hooks/useBookingApprove';
import useBookingNeedApproval from '../hooks/useBookingNeedApproval';
import BookingSummary from './BookingSummary';

const { Text } = Typography;

import { useMemo, useState } from 'react';

function NeedApproval({ onChangeTab }: { onChangeTab: (key: string) => void }) {
  const { data, isLoading, error } = useBookingNeedApproval();
  const { approveBooking, rejectBooking, isLoading: isActionLoading } = useBookingApprove();

  const [selectedBookings, setSelectedBookings] = useState<BookingType[]>([]);

  const allPendingBookings = useMemo(
    () => data?.filter((x) => x.status === BOOKING_STATUS_BOOKED) ?? [],
    [data],
  );

  const selectedPendingBookings = useMemo(
    () =>
      selectedBookings.filter(
        (booking) =>
          data?.find((item) => item.id === booking.id)?.status === BOOKING_STATUS_BOOKED,
      ),
    [selectedBookings, data],
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
            const checked = selectedBookings.some((booking) => booking.id === item.id);
            return (
              <List.Item style={{ paddingBlock: 24 }}>
                <Row gutter={[16, 8]} align="top" style={{ width: '100%' }}>
                  <Col flex="32px">
                    <Checkbox
                      checked={checked}
                      disabled={item.status !== BOOKING_STATUS_BOOKED}
                      onChange={(e) => toggleOne(item, e.target.checked)}
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
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
}
export default NeedApproval;
