import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { CREATE_BOOKING_CONFIRM_PATH, CREATE_HOTEL_SEARCH_PATH } from '@/constants/routePath';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import HotelDetail from '@/modules/Create/components/HotelDetail';
import HotelRoomInfo from '@/modules/Create/components/HotelRoomInfo';
import useHotelPropertyDetail from '@/modules/Create/hooks/useHotelPropertyDetail';
import useHotelRoomRate from '@/modules/Create/hooks/useHotelRoomRate';
import type { BookingParamsType, HotelPropertyType, HotelRoomRateType } from '@/types';
import { sessionStorageGet, sessionStorageSet } from '@/utils/sessionStorage';

function HotelRoomView() {
  const navigate = useNavigate();

  const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);
  const selectedHotel = bookingParams?.hotel?.selectedHotel as HotelPropertyType | undefined;
  const propertyId = selectedHotel?.propertyId ?? '';

  const {
    data: propertyDetailData,
    isLoading: propertyDetailLoading,
    getHotelPropertyDetails,
  } = useHotelPropertyDetail({ propertyId });

  const {
    data: roomRatesData,
    isLoading: roomRatesLoading,
    getHotelRoomRates,
  } = useHotelRoomRate({ propertyId, bookingParams: bookingParams ?? ({} as BookingParamsType) });

  const selectRoom = (room: HotelRoomRateType) => {
    const newBookingParams = {
      ...bookingParams,
      hotel: {
        ...bookingParams?.hotel,
        selectedRoom: room,
      },
    } as BookingParamsType;
    sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, newBookingParams);
    navigate(CREATE_BOOKING_CONFIRM_PATH);
  };

  useEffect(() => {
    if (propertyId) {
      getHotelPropertyDetails();
      getHotelRoomRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  useEffect(() => {
    if (!bookingParams || !bookingParams?.hotel?.selectedHotel) {
      navigate(CREATE_HOTEL_SEARCH_PATH);
      return;
    }
  }, [bookingParams, navigate]);

  const roomsContent = (
    <>
      {roomRatesLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin />
        </div>
      ) : roomRatesData?.data?.length ? (
        <div className="mt-4 space-y-3">
          {roomRatesData.data.map((room) => (
            <HotelRoomInfo key={room.roomId} room={room} onSelect={selectRoom} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No rooms found</div>
      )}
    </>
  );

  const hotel = propertyDetailData?.data?.propertyDatas?.[0];

  return (
    <Layout withSidebar={false}>
      <Row className="mb-4">
        <Col flex="300px">
          <Button
            color="primary"
            variant="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(CREATE_HOTEL_SEARCH_PATH)}
          >
            Back
          </Button>
        </Col>
      </Row>

      {propertyDetailLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin />
        </div>
      ) : (
        hotel && (
          <div className="mb-4">
            <HotelDetail hotel={hotel} roomsContent={roomsContent} />
          </div>
        )
      )}
    </Layout>
  );
}
export default HotelRoomView;
