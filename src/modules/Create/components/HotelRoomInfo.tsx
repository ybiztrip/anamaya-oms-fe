import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CoffeeOutlined,
  SafetyOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import { Button, Card, Carousel, Col, Image, Modal, Row, Space, Tabs, Tag } from 'antd';
import { useMemo, useState } from 'react';

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
  const [detailOpen, setDetailOpen] = useState(false);

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
  const isRefundable = room.isRefundable ?? room.refundable ?? false;

  const roomSummary = useMemo(() => {
    return (
      <div>
        <div className="text-lg font-semibold">{room.roomName}</div>
        <div className="text-xs text-gray-500 mt-1">
          {room.roomType} • {bedInfo} • {sizeInfo}
        </div>
        <div className="mt-2">
          <Space size={16} wrap>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              {isRefundable ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              )}
              {isRefundable ? 'Refundable' : 'Non-refundable'}
            </span>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <WifiOutlined style={{ color: room.wifiIncluded ? '#52c41a' : '#ff4d4f' }} />
              {room.wifiIncluded ? 'Wi‑Fi included' : 'No Wi‑Fi'}
            </span>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <CoffeeOutlined style={{ color: room.breakfastIncluded ? '#52c41a' : '#ff4d4f' }} />
              {room.breakfastIncluded ? 'Breakfast included' : 'No breakfast'}
            </span>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <SafetyOutlined />
              {room.smokingAllowed ? 'Smoking allowed' : 'Non‑smoking'}
            </span>
          </Space>
        </div>
      </div>
    );
  }, [
    room.roomName,
    room.roomType,
    room.wifiIncluded,
    room.breakfastIncluded,
    room.smokingAllowed,
    bedInfo,
    sizeInfo,
    isRefundable,
  ]);

  return (
    <Card key={room.roomId} size="small">
      <Row gutter={16} wrap={false} align="middle">
        <Col flex="200px">
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
        </Col>
        <Col flex="auto">
          {roomSummary}
          <Button className="mt-2" type="link" size="small" onClick={() => setDetailOpen(true)}>
            View detail
          </Button>
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
      <Modal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={900}
        styles={{ body: { height: 700, overflowY: 'auto' } }}
      >
        {roomSummary}
        <Tabs className="mt-4">
          <Tabs.TabPane tab="Gallery" key="gallery">
            <Carousel dots arrows>
              {images.map((url) => (
                <div key={url}>
                  <Image src={url} width="100%" height={530} style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </Carousel>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Property Facilities" key="property-facilities">
            <Space wrap>
              {room.propertyFacilities?.map((f) => (
                <Tag key={f.name}>{f.name}</Tag>
              ))}
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Room Facilities" key="room-facilities">
            <Space wrap>
              {room.roomFacilities?.map((f) => (
                <Tag key={f.facilityId}>{f.name}</Tag>
              ))}
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Cancellation Policy" key="cancellation-policy">
            <div className="text-sm text-gray-600">
              {room.cancellationPolicy?.displayText || room.cancellationPolicy?.text || '-'}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </Card>
  );
}
export default HotelInfo;
