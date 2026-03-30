import { Card, Form, Input, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';

import { ADULT_TYPE, CHILD_TYPE, INFANT_TYPE } from '@/constants/common';
import type {
  BookingParamsType,
  BookingPriceItemType,
  HotelPropertyType,
  HotelRoomRateType,
} from '@/types';

import HotelInfo from './HotelInfo';
import HotelRoomInfo from './HotelRoomInfo';

const HotelConfirm = ({
  hotel,
  room,
  bookingParams,
  onPriceListChange,
}: {
  hotel: HotelPropertyType;
  room: HotelRoomRateType;
  bookingParams: BookingParamsType;
  onPriceListChange?: (prices: BookingPriceItemType[]) => void;
}) => {
  const priceList = useMemo<BookingPriceItemType[]>(() => {
    const totalNight = dayjs(room.checkOutDate).diff(dayjs(room.checkInDate), 'day');
    return [
      {
        item: `Hotel x${totalNight} nights`,
        currency: 'IDR',
        amount: Number(room.totalRates.displaySellAmount),
      },
    ];
  }, [room.checkInDate, room.checkOutDate, room.totalRates.displaySellAmount]);

  useEffect(() => {
    onPriceListChange?.(priceList);
  }, [priceList, onPriceListChange]);

  return (
    <Card size="small">
      <HotelInfo hotel={hotel} withSelect={false} withPrice={false} />
      <div className="mt-2">
        <HotelRoomInfo room={room} withSelect={false} withPrice={false} />
      </div>
      <div className="text-lg font-semibold mt-2">Guests</div>
      <Space direction="vertical">
        <Card size="small">
          <Space direction="vertical">
            {bookingParams.paxList.map((pax) => (
              <Space key={pax.id}>
                <div className="text-medium font-semibold">
                  {`${pax.firstName} ${pax.lastName}`}
                </div>
                {pax.type === ADULT_TYPE && <Tag>Adult</Tag>}
                {pax.type === CHILD_TYPE && <Tag>Child</Tag>}
                {pax.type === INFANT_TYPE && <Tag>Infant</Tag>}
              </Space>
            ))}
          </Space>
        </Card>
      </Space>
      <Form.Item name="specialRequests" label="Special Requests" layout="vertical" className="mt-2">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Card>
  );
};

export default HotelConfirm;
