import { ArrowLeftOutlined, StarFilled } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Image,
  message,
  Row,
  Spin,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { documentUrl, fetchBookingDetail } from '@/api';
import Layout from '@/components/Layout';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { BOOKINGS_DETAIL } from '@/constants/queryKey';
import { APPROVAL_PATH } from '@/constants/routePath';
import PriceDetail from '@/modules/Create/components/PriceDetail';
import type { BookingDetailResponseType, BookingType, ResponseType } from '@/types';

const { Text, Title } = Typography;

type LocationState = {
  booking?: BookingType;
  fromTab?: string;
};

function BookingDetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const booking = state?.booking;
  const backPath = useMemo(() => {
    const tab = state?.fromTab ?? 'need-approval';
    return `${APPROVAL_PATH}?tab=${tab}`;
  }, [state?.fromTab]);

  const { data, isLoading, error } = useQuery({
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

  const attachmentKeys = useMemo(() => {
    return data?.attachments?.map((attachment) => attachment.file) ?? [];
  }, [data]);

  const { data: attachmentUrls, isLoading: isAttachmentLoading } = useQuery({
    queryKey: [BOOKINGS_DETAIL, id, 'attachments', attachmentKeys],
    queryFn: async () => {
      const results = await Promise.all(attachmentKeys.map((key: string) => documentUrl(key)));
      return results.map((res) => res.data);
    },
    enabled: !!id && attachmentKeys.length > 0,
  });

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
        <div className="mt-2">
          <Text type="secondary">Booking Code:</Text> {data.code}
        </div>
        <div className="mt-1">
          <Text type="secondary">Created:</Text> {dayjs(data.createdAt).format('ddd, MMM DD HH:mm')}
        </div>

        <Divider />

        {data.flights?.length > 0 && (
          <>
            <Title level={5}>Flights</Title>
            {data.flights.map((flight) => (
              <Card key={flight.id} size="small">
                <Row justify="space-between" align="top">
                  <Col>
                    <div>
                      <Text strong>{flight.origin}</Text> → <Text strong>{flight.destination}</Text>
                    </div>
                    <div className="text-sm text-gray-500">
                      {dayjs(flight.departureDatetime).format('ddd, MMM DD HH:mm')} -{' '}
                      {dayjs(flight.arrivalDatetime).format('ddd, MMM DD HH:mm')}
                    </div>
                  </Col>
                  <Col>{flight.status && <Tag color="blue">{flight.status}</Tag>}</Col>
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
                                <StarFilled key={i} style={{ color: '#69A8FF', fontSize: 12 }} />
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
                  <Col>{hotel.status && <Tag color="blue">{hotel.status}</Tag>}</Col>
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
        {isAttachmentLoading ? (
          <div className="w-full text-center">
            <Spin />
          </div>
        ) : attachmentUrls && attachmentUrls.length > 0 ? (
          <Row gutter={[16, 16]}>
            {attachmentUrls.map((url, index) => {
              const isImage = /\.(png|jpe?g|gif|webp)$/i.test(url);
              return (
                <Col key={url} xs={24} md={12} lg={8}>
                  <Card size="small">
                    {isImage ? (
                      <Image src={url} width="100%" />
                    ) : (
                      <a href={url} target="_blank" rel="noreferrer">
                        Open attachment {index + 1}
                      </a>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Text type="secondary">No attachments</Text>
        )}

        <Divider />

        <Title level={5}>Payments</Title>
        <PriceDetail prices={allPrices} />
      </Card>
    </Layout>
  );
}

export default BookingDetailView;
