import { Col, Row, Space, Typography } from 'antd';
import dayjs from 'dayjs';

import BookingStatusTag from '@/components/BookingStatusTag';
import { BOOKING_STATUS_APPROVED, BOOKING_STATUS_REJECTED } from '@/constants/common';
import useFlightAirport from '@/hooks/useFlightAirport';
import type { BookingType } from '@/types';
import { getBookingOverallStatus } from '@/utils/booking';

const { Text } = Typography;

interface BookingSummaryProps {
  data: BookingType;
}
function BookingSummary({ data }: Readonly<BookingSummaryProps>) {
  const { airportsByCode } = useFlightAirport();

  const { status, approvedAt, rejectedAt } = getBookingOverallStatus(data);

  const paxs = data.flights.length > 0 ? data.flights[0]?.paxs : (data.hotels[0]?.paxs ?? []);

  return (
    <div className="w-full min-w-0">
      <Row wrap={false} gutter={[12, 0]} align="top" justify="space-between" className="min-w-0">
        <Col flex="1 1 0%" style={{ minWidth: 'min(100%, 260px)' }}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text>
              <Text type="secondary">Booker:</Text> {data.contactFirstName} {data.contactLastName}
            </Text>
            <Text>
              <Text type="secondary">Passenger/Guest:</Text>{' '}
              {paxs.map((pax) => `${pax.firstName} ${pax.lastName}`).join(', ')}
            </Text>
          </Space>

          <div className="mt-2 space-y-1.5 min-w-0">
            {data.flights.map((flight) => {
              const depName = airportsByCode[flight.origin]?.localAirportName;
              return (
                <div
                  key={flight.id ?? `${flight.origin}-${flight.departureDatetime}`}
                  className="flex items-center justify-start gap-2"
                >
                  <Text className="text-xs sm:text-sm leading-snug block min-w-0 truncate">
                    {dayjs(flight.departureDatetime).format('ddd, MMM DD HH:mm')}{' '}
                    <Text strong>{flight.origin}</Text> → <Text strong>{flight.destination}</Text>
                    {depName && <Text type="secondary"> · {depName}</Text>}
                  </Text>
                  <BookingStatusTag status={flight.status} size="small" className="m-0 shrink-0" />
                </div>
              );
            })}

            {data.hotels.map((hotel) => (
              <div
                key={hotel.id ?? `${hotel.checkInDate}-${hotel.roomId}`}
                className="flex items-center justify-start gap-2"
              >
                <Text className="text-xs sm:text-sm leading-snug block min-w-0 [overflow-wrap:anywhere]">
                  {dayjs(hotel.checkInDate).format('ddd, MMM DD')} —{' '}
                  {dayjs(hotel.checkOutDate).format('ddd, MMM DD')}
                  {hotel.metadata?.hotelName && (
                    <>
                      {' '}
                      <Text strong>· {hotel.metadata.hotelName}</Text>
                    </>
                  )}
                  {hotel.metadata?.hotelRoomName && (
                    <Text type="secondary"> · {hotel.metadata.hotelRoomName}</Text>
                  )}
                </Text>
                <BookingStatusTag status={hotel.status} size="small" className="m-0 shrink-0" />
              </div>
            ))}
          </div>
        </Col>

        <Col flex="none" className="shrink-0 pl-1">
          <div className="flex flex-col items-end gap-2 text-right text-xs sm:text-sm">
            <BookingStatusTag status={status} className="m-0" />

            <Text type="secondary" className="block">
              Created: {dayjs.utc(data.createdAt).tz('Asia/Jakarta').format('ddd, MMM DD HH:mm')}
            </Text>
            {status === BOOKING_STATUS_APPROVED && approvedAt && (
              <Text type="secondary" className="block">
                Approved: {dayjs.utc(approvedAt).tz('Asia/Jakarta').format('ddd, MMM DD HH:mm')}
              </Text>
            )}
            {status === BOOKING_STATUS_REJECTED && rejectedAt && (
              <Text type="secondary" className="block">
                Rejected: {dayjs.utc(rejectedAt).tz('Asia/Jakarta').format('ddd, MMM DD HH:mm')}
              </Text>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default BookingSummary;
