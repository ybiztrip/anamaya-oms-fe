import { StarFilled } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';

import type { HotelPropertyType } from '@/types';
import { formatIDR } from '@/utils/formatter';

function HotelInfo({
  hotel,
  withPrice = true,
  withSelect = true,
  onSelect,
}: {
  hotel: HotelPropertyType;
  withPrice?: boolean;
  withSelect?: boolean;
  onSelect?: (hotel: HotelPropertyType) => void;
}) {
  const summary = hotel.propertySummary;
  const addressLines = summary?.address?.lines ?? [];
  const address = [addressLines.join(', '), summary?.address?.city, summary?.address?.country]
    .filter(Boolean)
    .join(', ');

  const imageEntry =
    hotel.propertyImages?.find((img) => img?.isMain || img?.main)?.entries?.[0] ??
    hotel.propertyImages?.[0]?.entries?.[0];

  const starCount = Number(summary?.starRating ?? 0);
  const rate = hotel.cheapestRoom?.chargeableRate;
  const currency = rate?.currencyCode ?? 'IDR';
  const total = rate?.total ?? '0';

  return (
    <Card key={hotel.propertyId} size="small">
      <Row align="middle" gutter={16} wrap={false}>
        <Col flex="120px">
          {imageEntry?.url ? (
            <img
              src={imageEntry.url}
              alt={summary?.name ?? 'Hotel'}
              style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8 }}
            />
          ) : (
            <div style={{ width: 120, height: 90, background: '#f5f5f5', borderRadius: 8 }} />
          )}
        </Col>
        <Col flex="auto">
          <div className="font-medium">{summary?.name ?? '-'}</div>
          {starCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              {Array.from({ length: starCount }).map((_, i) => (
                <StarFilled key={i} style={{ color: '#69A8FF', fontSize: 12 }} />
              ))}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">{address || '-'}</div>
          {hotel.cheapestRoomName && (
            <div className="text-xs text-gray-500 mt-1">{hotel.cheapestRoomName}</div>
          )}
        </Col>
        {withPrice && (
          <Col flex="180px" className="text-right">
            <div className="text-lg font-semibold">
              {currency} {formatIDR(total)}
            </div>
          </Col>
        )}
        {withSelect && (
          <Col flex="160px" className="text-right">
            <Button type="primary" className="mt-2" onClick={() => onSelect?.(hotel)}>
              See Detail
            </Button>
          </Col>
        )}
      </Row>
    </Card>
  );
}
export default HotelInfo;
