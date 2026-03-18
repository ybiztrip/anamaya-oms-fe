import { StarFilled } from '@ant-design/icons';
import { Card, Col, Image, Row, Space, Tabs, Tag } from 'antd';

import type { HotelPropertyType } from '@/types';

function HotelDetail({ hotel }: { hotel: HotelPropertyType }) {
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
        <Tabs.TabPane tab="Map" key="1">
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
        <Tabs.TabPane tab="Check-in & Important Information" key="2"></Tabs.TabPane>
      </Tabs>
    </Card>
  );
}
export default HotelDetail;
