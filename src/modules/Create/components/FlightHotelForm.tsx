import { StarFilled, SwapOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  type FormInstance,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { useEffect } from 'react';

import SelectAirport from '@/components/Select/SelectAirport';
import SelectHotelGeo from '@/components/Select/SelectHotelGeo';
import Upload from '@/components/Upload';
import { ADULT_AGE } from '@/constants/common';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import type { BookingParamsType, PassengerGuestType, TripType } from '@/types';
import dayjs from '@/utils/dayjs';
import { sessionStorageGet } from '@/utils/sessionStorage';

import { bookingParamsToFlightHotelForm } from '../utils/bookingFormMapper';

function normFile(
  e: UploadProps['onChange'] extends (...args: any) => any
    ? Parameters<UploadProps['onChange']>[0]
    : any,
) {
  if (Array.isArray(e)) return e;
  return e?.fileList as UploadFile[];
}

function FlightHotelForm({
  form,
  onTypeChange,
}: {
  form: FormInstance;
  onTypeChange: (key: string) => void;
}) {
  const tripType = Form.useWatch('tripType', form) as TripType | undefined;
  const depart = Form.useWatch('departureDate', form);

  const onSwap = () => {
    const origin = form.getFieldValue('origin');
    const destination = form.getFieldValue('destination');
    form.setFieldsValue({ origin: destination, destination: origin });
  };

  const checkInDate = Form.useWatch('checkInDate', form);
  const checkOutDate = Form.useWatch('checkOutDate', form);
  const nights = checkInDate && checkOutDate ? checkOutDate.diff(checkInDate, 'day') : 0;

  useEffect(() => {
    const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);
    if (bookingParams) {
      const flightHotelForm = bookingParamsToFlightHotelForm(bookingParams);
      form.setFieldsValue(flightHotelForm);
    }
  }, [form]);

  return (
    <>
      <Card
        className="mt-4"
        title={
          <Space>
            <Button
              variant="link"
              size="large"
              color="default"
              onClick={() => onTypeChange('flight')}
            >
              Flight
            </Button>
            <Button
              variant="link"
              size="large"
              color="default"
              onClick={() => onTypeChange('hotel')}
            >
              Hotel
            </Button>
            <Button variant="link" size="large" color="primary">
              Flight + Hotel
            </Button>
          </Space>
        }
        style={{
          border: 'none',
          boxShadow: 'none',
        }}
        styles={{
          header: {
            margin: '0 auto -24px auto',
            width: 'fit-content',
            borderRadius: 24,
            border: '1px #8BB9FF solid',
            backgroundColor: 'white',
            zIndex: 10,
            position: 'relative',
          },
          body: {
            border: '1px #8BB9FF solid',
            borderRadius: 24,
            paddingTop: 40,
            backgroundColor: '#fff',
            zIndex: 1,
            position: 'relative',
          },
        }}
      >
        <Form.Item name="tripType">
          <Radio.Group
            options={[
              { label: 'One-way', value: 'oneWay' },
              { label: 'Round-trip', value: 'roundTrip' },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        <Row gutter={[16, 8]} align="top" wrap>
          <Col span={12}>
            <Space.Compact block>
              <Form.Item
                name="origin"
                style={{ flex: 1, marginBottom: 0 }}
                rules={[
                  { required: true, message: 'Origin required' },
                  ({ getFieldValue }) => ({
                    validator: (_, v) =>
                      v && v === getFieldValue('destination')
                        ? Promise.reject(new Error('Origin and destination cannot be the same'))
                        : Promise.resolve(),
                  }),
                ]}
              >
                <SelectAirport showSearch placeholder="From" />
              </Form.Item>

              <Button onClick={onSwap} icon={<SwapOutlined />} />

              <Form.Item
                name="destination"
                style={{ flex: 1, marginBottom: 0 }}
                rules={[
                  { required: true, message: 'Destination required' },
                  ({ getFieldValue }) => ({
                    validator: (_, v) =>
                      v && v === getFieldValue('origin')
                        ? Promise.reject(new Error('Origin and destination cannot be the same'))
                        : Promise.resolve(),
                  }),
                ]}
              >
                <SelectAirport showSearch placeholder="To" />
              </Form.Item>
            </Space.Compact>
          </Col>
          <Col xs={24} md={12}>
            <Space.Compact block>
              <Form.Item
                name="departureDate"
                rules={[{ required: true }]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Departure date"
                  format="DD MMM YYYY"
                  disabledDate={(d) => d.isBefore(dayjs().add(1, 'day'))}
                />
              </Form.Item>
              {tripType === 'roundTrip' && (
                <>
                  <Input
                    className="site-input-split"
                    style={{
                      width: 30,
                      borderInlineStart: 0,
                      borderInlineEnd: 0,
                      pointerEvents: 'none',
                    }}
                    placeholder="~"
                    disabled
                  />
                  <Form.Item
                    name="returnDate"
                    rules={[{ required: true, message: 'Return date required for round-trip' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="Return date"
                      disabledDate={(d) => (depart ? d.isBefore(depart, 'day') : false)}
                      format="DD MMM YYYY"
                    />
                  </Form.Item>
                </>
              )}
            </Space.Compact>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="mt-4">
          <Col xs={24} md={8}>
            <Form.Item
              name="destinationGeo"
              label="Destination"
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
              rules={[{ required: true, message: 'Check out required' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(d) =>
                  checkInDate ? d.isBefore(checkInDate, 'day') : d.isBefore(dayjs().add(1, 'day'))
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
        </Row>
      </Card>
      <div className="space-y-4 mt-4">
        <Form.Item noStyle shouldUpdate={true}>
          {({ getFieldValue }) => (
            <Form.Item
              label="Booker"
              layout="horizontal"
              name="bookerName"
              rules={[{ required: true, message: 'Booker required' }]}
            >
              <span style={{ fontSize: 14 }}>{getFieldValue('bookerName')}</span>
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item
          label="Flight Class"
          name="flightClass"
          rules={[{ required: true, message: 'Flight Class required' }]}
          style={{ width: '300px' }}
        >
          <Select
            options={[
              { label: 'First Class', value: 'FIRST_CLASS' },
              { label: 'Premium Economy', value: 'PREMIUM_ECONOMY' },
              { label: 'Economy', value: 'ECONOMY' },
              { label: 'Business', value: 'BUSINESS' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Hotel Star"
          name="hotelStars"
          rules={[{ required: true, message: 'Hotel Class required' }]}
        >
          <Checkbox.Group>
            <Space size={16} wrap>
              {[1, 2, 3, 4, 5].map((n) => (
                <Checkbox
                  key={n}
                  value={String(n)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {Array.from({ length: n }).map((_, i) => (
                    <StarFilled
                      key={i}
                      style={{
                        color: '#69A8FF',
                        fontSize: 16,
                      }}
                    />
                  ))}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prev, next) => prev.paxList !== next.paxList}>
          {({ getFieldValue }) => (
            <Form.Item
              label="Rooms"
              name="rooms"
              dependencies={['paxList']}
              rules={[
                { required: true, message: 'Rooms required' },
                () => ({
                  validator: (_, value) => {
                    const paxList = getFieldValue('paxList') ?? [];

                    let totalAdult = 0;
                    paxList?.forEach((pax: PassengerGuestType) => {
                      if (dayjs(pax.dob).isBefore(dayjs().subtract(ADULT_AGE, 'year'))) {
                        totalAdult++;
                      }
                    });
                    if (!value || value <= totalAdult) return Promise.resolve();
                    return Promise.reject(
                      new Error(
                        `Rooms must be less than or equal to total adult guests (${totalAdult})`,
                      ),
                    );
                  },
                }),
              ]}
            >
              <InputNumber placeholder="Total Rooms" style={{ width: '160px' }} min={1} />
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item
          label="Attachment"
          name="attachments"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          style={{ marginBottom: 16, marginLeft: 10, width: '400px' }}
        >
          <Upload />
        </Form.Item>
      </div>
    </>
  );
}
export default FlightHotelForm;
