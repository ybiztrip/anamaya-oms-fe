import { Button, Card, Col, DatePicker, Form, InputNumber, Row, Select, Space, Spin } from 'antd';
import { useEffect, useRef } from 'react';

import SelectHotelGeo from '@/components/Select/SelectHotelGeo';
import type { BookingParamsType, HotelPropertyType } from '@/types';
import dayjs from '@/utils/dayjs';

import useHotelSearch from '../hooks/useHotelSearch';
import HotelInfo from './HotelInfo';

function HotelSearchForm({
  bookingParams,
  onSelectHotel,
}: {
  bookingParams: BookingParamsType;
  onSelectHotel: (hotel: HotelPropertyType, formValues: any) => void;
}) {
  const [form] = Form.useForm();
  const checkInDate = Form.useWatch('checkInDate', form);
  const checkOutDate = Form.useWatch('checkOutDate', form);
  const nights = checkInDate && checkOutDate ? checkOutDate.diff(checkInDate, 'day') : 0;

  const { hotelParams, handleSearchHotels, data, isLoading } = useHotelSearch({
    bookingParams,
  });

  const autoSearchRef = useRef(false);
  useEffect(() => {
    if (autoSearchRef.current) return;

    if (hotelParams?.destinationGeo && hotelParams?.checkInDate && hotelParams?.checkOutDate) {
      form.submit();
      autoSearchRef.current = true;
    }
  }, [hotelParams, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...hotelParams,
        destination: hotelParams?.destinationGeo
          ? { value: hotelParams?.destinationGeo, label: hotelParams?.destinationName }
          : undefined,
        checkInDate: hotelParams?.checkInDate ? dayjs(hotelParams.checkInDate) : undefined,
        checkOutDate: hotelParams?.checkOutDate ? dayjs(hotelParams.checkOutDate) : undefined,
        sortBy: 'HIGHEST_PRICE',
      }}
      onFinish={handleSearchHotels}
    >
      <Row>
        <Col flex="300px"></Col>
        <Col flex="auto">
          <Card
            className="mt-4"
            style={{
              border: 'none',
              boxShadow: 'none',
            }}
            styles={{
              body: {
                border: '1px #8BB9FF solid',
                borderRadius: 24,
                backgroundColor: '#fff',
                zIndex: 1,
                position: 'relative',
              },
            }}
          >
            <Row gutter={[16, 8]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="destination"
                  label="Destination"
                  layout="vertical"
                  style={{ flex: 1, marginBottom: 0 }}
                  rules={[{ required: true, message: 'Destination required' }]}
                >
                  <SelectHotelGeo placeholder="City, Hotel name" labelInValue />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="checkInDate"
                  label="Check in"
                  layout="vertical"
                  rules={[{ required: true, message: 'Check in required' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={(d) => d.isBefore(dayjs().add(1, 'day'))}
                    format="DD MMM YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="checkOutDate"
                  label="Check out"
                  layout="vertical"
                  rules={[{ required: true, message: 'Check out required' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={(d) =>
                      checkInDate
                        ? d.isBefore(checkInDate, 'day')
                        : d.isBefore(dayjs().add(1, 'day'))
                    }
                    format="DD MMM YYYY"
                  />
                </Form.Item>
              </Col>
              {checkInDate && checkOutDate && (
                <Col xs={24} md={4}>
                  <div className="mt-8">{nights} nights</div>
                </Col>
              )}

              <Col xs={24} md={4}>
                <Button color="primary" variant="filled" htmlType="submit" block>
                  Search
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col flex="300px" className="pr-8">
          <Row className="mt-8">
            <Col xs={12} md={12} lg={24}>
              <Form.Item name="sortBy" label="Sort By">
                <Select
                  placeholder="Sort By"
                  options={[
                    { label: 'Lowest Price', value: 'LOWEST_PRICE' },
                    { label: 'Highest Price', value: 'HIGHEST_PRICE' },
                  ]}
                  style={{ width: 'fit-content' }}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={12} lg={24}>
              <Form.Item label="Price Range">
                <Space.Compact block>
                  <Form.Item name="minPrice" noStyle initialValue={0}>
                    <InputNumber min={0} placeholder="Min" style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="maxPrice" noStyle initialValue={10000000}>
                    <InputNumber min={0} placeholder="Max" style={{ width: '100%' }} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col flex="auto">
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Spin />
              </div>
            ) : (
              <>
                {data && data?.data?.properties?.length === 0 && (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-gray-500">No hotels found</div>
                  </div>
                )}
                {data?.data?.properties?.map((r: HotelPropertyType) => {
                  return (
                    <HotelInfo
                      key={r.propertyId}
                      hotel={r}
                      onSelect={() => onSelectHotel(r, form.getFieldsValue())}
                    />
                  );
                })}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default HotelSearchForm;
