import { Col, Row, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

import {
  BOOKING_STATUS_APPROVED,
  BOOKING_STATUS_BOOKED,
  BOOKING_STATUS_REJECTED,
} from '@/constants/common';
import type { BookingType } from '@/types';

const { Text } = Typography;

interface BookingSummaryProps {
  data: BookingType;
}
function BookingSummary({ data }: BookingSummaryProps) {
  const status = [
    data.status,
    ...data.flights.map((flight) => flight.status),
    ...data.hotels.map((hotel) => hotel.status),
  ].includes(BOOKING_STATUS_BOOKED)
    ? BOOKING_STATUS_BOOKED
    : data.status === BOOKING_STATUS_APPROVED
      ? BOOKING_STATUS_APPROVED
      : BOOKING_STATUS_REJECTED;
  return (
    <div>
      <Row gutter={[16, 8]} align="top" justify="space-between" style={{ width: '100%' }}>
        <Col>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text>
              <Text type="secondary">Booker:</Text> {data.contactFirstName} {data.contactLastName}
            </Text>
            <Text>
              <Text type="secondary">Passenger:</Text>{' '}
              {data.flights[0]?.paxs.map((pax) => `${pax.firstName} ${pax.lastName}`).join(', ')}
            </Text>
          </Space>

          <Space direction="vertical" size={4} className="mt-2" style={{ width: '100%' }}>
            {data.flights.map((flight) => (
              <>
                <Text>
                  {dayjs(flight.departureDatetime).format('ddd, MMM DD HH:mm')}{' '}
                  <Text strong>{flight.origin}</Text>
                </Text>
                <Text key={flight.id}>
                  {dayjs(flight.arrivalDatetime).format('ddd, MMM DD HH:mm')}{' '}
                  <Text strong>{flight.destination}</Text>
                </Text>
              </>
            ))}
            {data.hotels.map((hotel) => (
              <>
                <Text>
                  {dayjs(hotel.checkInDate).format('ddd, MMM DD')} -{' '}
                  {dayjs(hotel.checkOutDate).format('ddd, MMM DD')} {/* TODO: Hotel Info */}
                  <Text strong>Hotel</Text>
                </Text>
              </>
            ))}
          </Space>
        </Col>

        <Col>
          <Space direction="vertical" align="end" size={8} style={{ width: '100%' }}>
            <Tag
              color={
                status === BOOKING_STATUS_BOOKED
                  ? 'blue'
                  : status === BOOKING_STATUS_APPROVED
                    ? 'green'
                    : 'red'
              }
            >
              {status}
            </Tag>

            <Text type="secondary">
              Created: {dayjs(data.createdAt).format('ddd, MMM DD HH:mm')}
            </Text>
            {data.status === BOOKING_STATUS_APPROVED && (
              <Text type="secondary">
                Approved: {dayjs(data.approvedAt).format('ddd, MMM DD HH:mm')}
              </Text>
            )}
            {data.status === BOOKING_STATUS_REJECTED && (
              <Text type="secondary">
                Rejected: {dayjs(data.rejectedAt).format('ddd, MMM DD HH:mm')}
              </Text>
            )}
          </Space>
        </Col>
      </Row>
    </div>
  );
}
export default BookingSummary;
