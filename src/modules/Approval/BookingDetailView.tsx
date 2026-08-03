import { ArrowLeftOutlined, StarFilled } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Spin,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { fetchBookingDetail } from '@/api';
import BookingStatusTag from '@/components/BookingStatusTag';
import DocumentLinks from '@/components/DocumentLinks';
import Layout from '@/components/Layout';
import {
  BOOKING_STATUS_APPROVED,
  BOOKING_STATUS_BOOKED,
  BOOKING_STATUS_REJECTED,
  DEFAULT_ERROR_MESSAGE,
} from '@/constants/common';
import { PERMISSIONS } from '@/constants/permission';
import { BOOKINGS_DETAIL } from '@/constants/queryKey';
import { APPROVAL_PATH } from '@/constants/routePath';
import useFlightAirlines from '@/hooks/useFlightAirlines';
import useFlightAirport from '@/hooks/useFlightAirport';
import PriceDetail from '@/modules/Create/components/PriceDetail';
import type {
  BookingApprovePayloadType,
  BookingDetailResponseType,
  BookingType,
  ResponseType,
} from '@/types';
import { getBookingOverallStatus } from '@/utils/booking';
import { isPermitted } from '@/utils/permission';

import useBookingApprove from './hooks/useBookingApprove';

const { Text, Title } = Typography;

type LocationState = {
  booking?: BookingType;
  fromTab?: string;
};

function BookingDetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { airportsByCode } = useFlightAirport();
  const { airlinesByCode } = useFlightAirlines();
  const { approveBooking, rejectBooking, isLoading: isActionLoading } = useBookingApprove();
  const state = location.state as LocationState | null;

  const booking = state?.booking;
  const backPath = useMemo(() => {
    const tab = state?.fromTab ?? 'need-approval';
    return `${APPROVAL_PATH}?tab=${tab}`;
  }, [state?.fromTab]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [BOOKINGS_DETAIL, id],
    queryFn: () => fetchBookingDetail(String(id)),
    enabled: !!id,
    initialData: booking
      ? ({ success: true, message: '', data: booking } as ResponseType<BookingDetailResponseType>)
      : undefined,
    select: (response) => {
      if (!response.success) {
        message.error(response.message);
      }
      return response.data;
    },
  });

  const { status, approvedAt, rejectedAt } = data
    ? getBookingOverallStatus(data)
    : { status: '', approvedAt: '', rejectedAt: '' };
  const isApprovalPermitted = isPermitted(PERMISSIONS.APPROVAL);
  const canTakeApprovalAction = isApprovalPermitted && status === BOOKING_STATUS_BOOKED;

  const buildPayload = (booking: BookingType): BookingApprovePayloadType => {
    const flightIds = (booking.flights ?? [])
      .filter((flight) => flight.status === BOOKING_STATUS_BOOKED && flight.id)
      .map((flight) => Number(flight.id))
      .filter((bookingId) => !Number.isNaN(bookingId));
    const hotelIds = (booking.hotels ?? [])
      .filter((hotel) => hotel.status === BOOKING_STATUS_BOOKED && hotel.id)
      .map((hotel) => Number(hotel.id))
      .filter((bookingId) => !Number.isNaN(bookingId));

    return { flightIds, hotelIds };
  };

  const approve = async () => {
    if (!data) return;
    await approveBooking({ id: String(data.id), payload: buildPayload(data) });
    await refetch();
  };

  const reject = async () => {
    if (!data) return;
    await rejectBooking({ id: String(data.id), payload: buildPayload(data) });
    await refetch();
  };

  const confirmApprove = () => {
    if (!canTakeApprovalAction || isActionLoading) return;

    Modal.confirm({
      title: 'Approve Booking Request',
      content: 'Are you sure you want to approve this booking?',
      okText: 'Approve',
      cancelText: 'Cancel',
      okButtonProps: { type: 'primary' },
      onOk: approve,
    });
  };

  const confirmReject = () => {
    if (!canTakeApprovalAction || isActionLoading) return;

    Modal.confirm({
      title: 'Reject Booking Request',
      content: 'Are you sure you want to reject this booking?',
      okText: 'Reject',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: reject,
    });
  };

  const allPrices = useMemo(() => {
    return [
      ...(data?.flights ?? []).flatMap((flight) => flight.metadata?.prices ?? []),
      ...(data?.hotels ?? []).flatMap((hotel) => hotel.metadata?.prices ?? []),
    ];
  }, [data?.flights, data?.hotels]);

  const paxs =
    data?.flights?.length && data?.flights?.length > 0
      ? data?.flights[0]?.paxs
      : (data?.hotels?.[0]?.paxs ?? []);

  if (!id) {
    return (
      <Layout>
        <Button
          className="mb-4"
          color="primary"
          variant="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(backPath)}
        >
          Back
        </Button>
        <Card>
          <Title level={4}>Booking Detail</Title>
          <Text type="secondary">Booking ID tidak ditemukan.</Text>
        </Card>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <Button
          className="mb-4"
          color="primary"
          variant="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(backPath)}
        >
          Back
        </Button>
        <Card>
          <div className="w-full text-center">
            <Spin />
          </div>
        </Card>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <Button
          className="mb-4"
          color="primary"
          variant="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(backPath)}
        >
          Back
        </Button>
        <Card>
          <Title level={4}>Booking Detail</Title>
          <Alert message={(error as any)?.message ?? DEFAULT_ERROR_MESSAGE} type="error" />
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <Row justify="space-between" align="middle">
        <Col>
          <Button
            className="mb-4"
            color="primary"
            variant="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(backPath)}
          >
            Back
          </Button>
        </Col>

        {canTakeApprovalAction && (
          <Col>
            <div className="flex items-center gap-2">
              <Button danger loading={isActionLoading} onClick={confirmReject}>
                Reject
              </Button>
              <Button type="primary" loading={isActionLoading} onClick={confirmApprove}>
                Approve
              </Button>
            </div>
          </Col>
        )}
      </Row>
      <Card>
        <Row justify="space-between" align="top">
          <Col>
            <Title level={4}>Booking Detail</Title>
          </Col>
          <Col>
            <BookingStatusTag status={status} size="large" />
          </Col>
        </Row>
        <Row justify="space-between" align="bottom">
          <Col>
            <div className="mt-2">
              <Text type="secondary">Booking Code:</Text> {data.code}
            </div>
            <div className="mt-1">
              <Text type="secondary">Created:</Text>{' '}
              {dayjs.utc(data.createdAt).tz('Asia/Jakarta').format('ddd, MMM DD HH:mm')}
            </div>
            {status === BOOKING_STATUS_APPROVED && approvedAt && (
              <div className="mt-1">
                <Text type="secondary">Approved:</Text>{' '}
                {dayjs.utc(approvedAt).tz('Asia/Jakarta').format('ddd, MMM DD HH:mm')}
              </div>
            )}
            {status === BOOKING_STATUS_REJECTED && rejectedAt && (
              <div className="mt-1">
                <Text type="secondary">Rejected:</Text>{' '}
                {dayjs.utc(rejectedAt).tz('Asia/Jakarta').format('ddd, MMM DD HH:mm')}
              </div>
            )}
          </Col>
        </Row>
        <Divider />

        {data.flights?.length > 0 && (
          <>
            <Title level={5}>Flights</Title>
            {data.flights.map((flight) => (
              <Card key={flight.id} size="small">
                <Row justify="space-between" align="top">
                  <Col>
                    <div>
                      <Text strong>
                        {`${airportsByCode[flight.origin]?.localAirportName} (${flight.origin})`}
                      </Text>
                      {' → '}
                      <Text strong>
                        {`${airportsByCode[flight.destination]?.localAirportName} (${flight.destination})`}
                      </Text>
                    </div>
                    <div>
                      {flight.metadata?.airlines?.map((airline, airlineIndex) => (
                        <div key={`${flight.id}-airline-${airlineIndex}`}>
                          {airlinesByCode[airline]?.airlineName ?? '-'} (
                          {flight.metadata?.flightCodes?.[airlineIndex] ?? '-'})
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {dayjs(flight.departureDatetime).format('ddd, MMM DD HH:mm')}{' '}
                      {flight.metadata?.departureTerminal
                        ? `(${flight.metadata?.departureTerminal})`
                        : ''}{' '}
                      - {dayjs(flight.arrivalDatetime).format('ddd, MMM DD HH:mm')}{' '}
                      {flight.metadata?.arrivalTerminal
                        ? `(${flight.metadata?.arrivalTerminal})`
                        : ''}
                    </div>
                  </Col>
                  <Col>
                    <BookingStatusTag status={flight.status} />
                  </Col>
                </Row>
              </Card>
            ))}
            <Divider />
          </>
        )}

        {data.hotels?.length > 0 && (
          <>
            <Title level={5}>Hotels</Title>
            {data.hotels.map((hotel) => (
              <Card key={hotel.id} size="small">
                <Row justify="space-between" align="top">
                  <Col>
                    <div className="flex flex-col gap-1">
                      <Text strong>{hotel.metadata?.hotelName}</Text>
                      <Text type="secondary">{hotel.metadata?.hotelAddress}</Text>
                      {hotel.metadata?.hotelStarRating &&
                        Number(hotel.metadata?.hotelStarRating) > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            {Array.from({ length: Number(hotel.metadata?.hotelStarRating) }).map(
                              (_, i) => (
                                <StarFilled
                                  key={`${hotel.id ?? 'hotel'}-star-${i}`}
                                  style={{ color: '#69A8FF', fontSize: 12 }}
                                />
                              ),
                            )}
                          </div>
                        )}
                      <Text type="secondary">{hotel.metadata?.hotelRoomName}</Text>
                      <Text type="secondary">
                        {dayjs(hotel.checkInDate).format('ddd, MMM DD')} -{' '}
                        {dayjs(hotel.checkOutDate).format('ddd, MMM DD')}
                      </Text>
                    </div>
                  </Col>
                  <Col>
                    <BookingStatusTag status={hotel.status} />
                  </Col>
                </Row>
              </Card>
            ))}
            <Divider />
          </>
        )}

        <Title level={5}>Passengers/Guests</Title>
        <Row gutter={[16, 16]}>
          {paxs?.map((pax) => (
            <Col xs={24} md={12} lg={8} key={pax.id}>
              <Card size="small">
                <div className="font-semibold">
                  {pax.firstName} {pax.lastName}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="mr-2">{pax.title}</span>
                  <Tag>{pax.type}</Tag>
                </div>
                <Divider className="my-2" />
                <div className="text-sm">
                  <div>
                    <Text type="secondary">Email:</Text> {pax.email}
                  </div>
                  <div>
                    <Text type="secondary">Phone:</Text> {pax.phoneNumber}
                  </div>
                  <div>
                    <Text type="secondary">Date of Birth:</Text> {pax.dob}
                  </div>
                  <div>
                    <Text type="secondary">Document:</Text> {pax.documentType} {pax.documentNo}
                  </div>
                  <div>
                    <Text type="secondary">Expiry:</Text> {pax.expirationDate}
                  </div>
                  <div>
                    <Text type="secondary">Nationality:</Text> {pax.nationality}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        <Title level={5}>Additional Information</Title>
        <DocumentLinks attachments={data?.attachments} emptyText="No attachments" />

        <Divider />

        <Title level={5}>Payments</Title>
        <PriceDetail prices={allPrices} />
      </Card>
    </Layout>
  );
}

export default BookingDetailView;
