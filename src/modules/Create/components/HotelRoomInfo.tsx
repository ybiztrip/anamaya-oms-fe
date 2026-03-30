import { Button, Card, Col, Image, Row, Space, Tag } from 'antd';
import { useState } from 'react';

import type { HotelRoomRateType } from '@/types';
import { formatIDR } from '@/utils/formatter';

function HotelInfo({
  room,
  withPrice = true,
  withSelect = true,
  onSelect,
}: {
  room: HotelRoomRateType;
  withPrice?: boolean;
  withSelect?: boolean;
  onSelect?: (room: HotelRoomRateType) => void;
}) {
  const images =
    room.roomImages
      ?.flatMap((img) => img.entries?.map((e) => ({ url: e.url, imageType: e.imageType })) ?? [])
      ?.filter((e) => e.imageType === 'LARGE')
      ?.map((e) => e.url) ?? [];
  const mainImage = images?.[0];

  const bedInfo =
    room.bedArrangement?.[0]?.bedroomLayouts?.[0]?.arrangements
      ?.map((b) => `${b.total} ${b.bedType}`)
      .join(', ') ?? '-';

  const sizeInfo = room.roomSize?.size
    ? `${room.roomSize.size} ${room.roomSize.unit ?? ''}`.trim()
    : '-';
  const priceCurrency = room.totalRates?.displayCurrency ?? 'IDR';
  const priceTotal = room.totalRates?.displaySellAmount ?? 0;
  const nightly = room.nightlyRates?.displaySellAmount ?? 0;
  const facilities = room.roomFacilities ?? [];
  const [showAllFacilities, setShowAllFacilities] = useState(false);

  return (
    <Card key={room.roomId} size="small">
      <Row gutter={16} wrap={false} align="middle">
        <Col flex="200px">
          <Image.PreviewGroup>
            {mainImage ? (
              <Image
                src={mainImage}
                alt={room.roomName}
                width={180}
                height={180}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
            ) : (
              <div style={{ width: '100%', height: 180, background: '#f5f5f5', borderRadius: 8 }} />
            )}
            {images.slice(1, images.length).map((url, idx) => (
              <Image key={`${url}-${idx}`} src={url} style={{ display: 'none' }} />
            ))}
          </Image.PreviewGroup>
        </Col>
        <Col flex="auto">
          <div className="text-lg font-semibold">{room.roomName}</div>
          <div className="text-xs text-gray-500 mt-1">
            {room.roomType} • {bedInfo} • {sizeInfo}
          </div>
          <div className="mt-2">
            <Space size={6} wrap>
              {(showAllFacilities ? facilities : facilities.slice(0, 4)).map((f) => (
                <Tag key={f.facilityId}>{f.name}</Tag>
              ))}
              {facilities.length > 4 && !showAllFacilities && (
                <Button type="link" size="small" onClick={() => setShowAllFacilities(true)}>
                  +{facilities.length - 4} more
                </Button>
              )}
              {facilities.length > 4 && showAllFacilities && (
                <Button type="link" size="small" onClick={() => setShowAllFacilities(false)}>
                  Show less
                </Button>
              )}
            </Space>
          </div>
        </Col>
        {(withPrice || withSelect) && (
          <Col flex="200px" className="text-right">
            {withPrice && (
              <>
                <div className="text-lg font-semibold">
                  {priceCurrency} {formatIDR(String(priceTotal))}
                </div>
                <div className="text-xs text-gray-500">
                  {priceCurrency} {formatIDR(String(nightly))} / night
                </div>
              </>
            )}
            {withSelect && (
              <Button className="mt-2" type="primary" onClick={() => onSelect?.(room)}>
                Select
              </Button>
            )}
          </Col>
        )}
      </Row>
    </Card>
  );
}
export default HotelInfo;
