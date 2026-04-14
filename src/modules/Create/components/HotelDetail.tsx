import { StarFilled } from '@ant-design/icons';
import { Card, Col, Image, Row, Space, Tabs, Tag, Typography } from 'antd';

import type { HotelPropertyDetailType } from '@/types';

function HotelDetail({
  hotel,
  roomsContent,
}: {
  hotel: HotelPropertyDetailType;
  roomsContent?: React.ReactNode;
}) {
  const { Text, Title } = Typography;
  const summary = hotel?.propertySummary;
  const addressLines = summary?.address?.lines ?? [];
  const address = [addressLines.join(', '), summary?.address?.city, summary?.address?.country]
    .filter(Boolean)
    .join(', ');
  const starCount = Number(summary?.starRating ?? 0);

  const images =
    hotel?.propertyImages
      ?.flatMap((img) => img.entries?.map((e) => ({ url: e.url, imageType: e.imageType })) ?? [])
      ?.filter((e) => e.imageType === 'LARGE')
      ?.map((e) => e.url) ?? [];
  const mainImage = images?.[0];

  const lat = summary?.geoLocation?.lat;
  const lon = summary?.geoLocation?.lon;
  const mapUrl = lat && lon ? `https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed` : '';
  const mapLink = lat && lon ? `https://www.google.com/maps?q=${lat},${lon}` : '';

  const facilities = hotel?.propertyAmenities?.map((f) => f.name) ?? [];

  const checkInInfo = hotel?.checkInInfo;
  const checkOutInfo = hotel?.checkOutInfo;
  const feesInfo = hotel?.feesInfo;
  const policiesInfo = hotel?.policiesInfo;

  const hasHtml = (value?: string | null) => Boolean(value && value.trim());
  const renderHtml = (value?: string | null) =>
    hasHtml(value) ? (
      <div
        className="text-sm text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: value ?? '' }}
      />
    ) : null;

  return (
    <Card key={hotel.propertyId} size="small">
      <div>
        <div className="text-xl font-semibold">{summary?.name ?? '-'}</div>
        {starCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            {Array.from({ length: starCount }).map((_, i) => (
              <StarFilled key={i} style={{ color: '#69A8FF', fontSize: 12 }} />
            ))}
          </div>
        )}
        <div className="text-sm text-gray-500 mt-2">{address || '-'}</div>
        <div className="text-xs text-gray-500 mt-2">
          {summary?.phoneNumber ? `• ${summary.phoneNumber}` : ''}
        </div>

        <div className="mt-3">
          <Space size={6} wrap>
            {summary?.accommodationType && <Tag>{summary.accommodationType}</Tag>}
            {summary?.reviewScore && <Tag>Score: {summary.reviewScore}</Tag>}
          </Space>
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Image.PreviewGroup>
            <Row gutter={[8, 8]} className="mt-4">
              <Col xs={24} md={16}>
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={summary?.name ?? 'Hotel'}
                    width="100%"
                    height={372}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                ) : (
                  <div
                    style={{ width: '100%', height: 240, background: '#f5f5f5', borderRadius: 8 }}
                  />
                )}
              </Col>
              <Col xs={24} md={8}>
                {images.slice(1, 4).map((url, idx) => (
                  <Image
                    key={`${url}-${idx}`}
                    src={url}
                    width="100%"
                    height={120}
                    style={{ objectFit: 'cover', borderRadius: 6 }}
                  />
                ))}
                {images.slice(5, images.length).map((url, idx) => (
                  <Image key={`${url}-${idx}`} src={url} style={{ display: 'none' }} />
                ))}
              </Col>
            </Row>
          </Image.PreviewGroup>
        </>
      )}

      <Tabs>
        <Tabs.TabPane tab="Available Rooms" key="rooms">
          {roomsContent ?? <div className="text-gray-500">No rooms</div>}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Map" key="map">
          {mapUrl ? (
            <div>
              <iframe
                title="hotel-map"
                src={mapUrl}
                style={{ width: '100%', height: 240, border: 0, borderRadius: 8 }}
                loading="lazy"
              />
              {mapLink && (
                <div className="text-xs text-gray-500 mt-2">
                  <a href={mapLink} target="_blank" rel="noreferrer">
                    Open in Google Maps
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Map location not available.</div>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Facilities" key="facilities">
          {facilities.length > 0 ? (
            <ul className="m-0 list-none space-y-2 pl-0 text-sm text-gray-800">
              {facilities.map((facility, idx) => (
                <li key={`${idx}-${facility}`} className="flex gap-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#69A8FF]"
                    aria-hidden
                  />
                  <span>{facility}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No facilities listed.</div>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Check-in & Important Information" key="check-in-info">
          <div className="space-y-6 text-gray-800">
            {(checkInInfo?.begin_time || checkInInfo?.min_age) && (
              <div>
                <Title level={5} className="m-0">
                  Check-in
                </Title>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  {checkInInfo?.begin_time && (
                    <div>
                      <Text type="secondary">Check-in time:</Text> {checkInInfo.begin_time}
                    </div>
                  )}
                  {checkInInfo?.min_age && (
                    <div>
                      <Text type="secondary">Minimum age:</Text> {checkInInfo.min_age}
                    </div>
                  )}
                </div>
              </div>
            )}

            {checkOutInfo?.time && (
              <div>
                <Title level={5} className="m-0">
                  Check-out
                </Title>
                <div className="mt-2 text-sm text-gray-700">
                  <Text type="secondary">Check-out time:</Text> {checkOutInfo.time}
                </div>
              </div>
            )}

            {(hasHtml(checkInInfo?.instructions) || hasHtml(checkInInfo?.special_instructions)) && (
              <div>
                <Title level={5} className="m-0">
                  Important Information
                </Title>
                <div className="mt-2 space-y-3">
                  {renderHtml(checkInInfo?.instructions)}
                  {renderHtml(checkInInfo?.special_instructions)}
                </div>
              </div>
            )}

            {(hasHtml(feesInfo?.optional) || hasHtml(feesInfo?.mandatory)) && (
              <div>
                <Title level={5} className="m-0">
                  Fees & Charges
                </Title>
                <div className="mt-2 space-y-3">
                  {renderHtml(feesInfo?.optional)}
                  {renderHtml(feesInfo?.mandatory)}
                </div>
              </div>
            )}

            {(hasHtml(policiesInfo?.instructions) || hasHtml(policiesInfo?.know_before_you_go)) && (
              <div>
                <Title level={5} className="m-0">
                  Policies
                </Title>
                <div className="mt-2 space-y-3">
                  {renderHtml(policiesInfo?.instructions)}
                  {renderHtml(policiesInfo?.know_before_you_go)}
                </div>
              </div>
            )}

            {!checkInInfo && !checkOutInfo && !feesInfo && !policiesInfo && (
              <div className="text-sm text-gray-500">Information not available.</div>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
}
export default HotelDetail;
