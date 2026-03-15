import { StarFilled } from '@ant-design/icons';
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
  Row,
  Select,
  Space,
  type UploadFile,
  type UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import Upload from '@/components/Upload';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import type { BookingParamsType } from '@/types';
import { sessionStorageGet } from '@/utils/sessionStorage';

import { bookingParamsToHotelForm } from '../utils/bookingFormMapper';

const { RangePicker } = DatePicker;

const destinationOptions = [
  { value: 'CGK', label: 'Jakarta' },
  { value: 'DPS', label: 'Denpasar' },
];

function normFile(
  e: UploadProps['onChange'] extends (...args: any) => any
    ? Parameters<UploadProps['onChange']>[0]
    : any,
) {
  if (Array.isArray(e)) return e;
  return e?.fileList as UploadFile[];
}

function HotelForm({
  form,
  onTypeChange,
}: {
  form: FormInstance;
  onTypeChange: (key: string) => void;
}) {
  const stayRange = Form.useWatch('stayRange', form);
  const nights = stayRange?.[0] && stayRange?.[1] ? stayRange[1].diff(stayRange[0], 'day') : 0;
  const paxList = Form.useWatch('paxList', form);

  useEffect(() => {
    const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);
    if (bookingParams) {
      const hotelForm = bookingParamsToHotelForm(bookingParams);
      form.setFieldsValue(hotelForm);
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
            <Button variant="link" size="large" color="primary">
              Hotel
            </Button>
            <Button
              variant="link"
              size="large"
              color="default"
              onClick={() => onTypeChange('flight-hotel')}
            >
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
        <Row gutter={[16, 8]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="destination"
              label="Destination"
              layout="vertical"
              style={{ flex: 1, marginBottom: 0 }}
              rules={[{ required: true, message: 'Origin required' }]}
            >
              <Select showSearch options={destinationOptions} placeholder="City, Hotel name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="stayRange"
              label="Check in - Check out"
              layout="vertical"
              rules={[{ required: true }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                disabledDate={(d) => d.isBefore(dayjs().add(1, 'day'))}
                format="DD MMM YYYY"
              />
            </Form.Item>
          </Col>
          {stayRange?.[0] && stayRange?.[1] && (
            <Col xs={24} md={4}>
              <div className="mt-8">{nights} nights</div>
            </Col>
          )}
        </Row>
      </Card>

      <div className="space-y-4 mt-4">
        {/* Booker */}
        <Form.Item noStyle shouldUpdate={true}>
          {({ getFieldValue }) => (
            <Form.Item
              label="Booker"
              name="bookerName"
              rules={[{ required: true, message: 'Booker required' }]}
            >
              <span style={{ fontSize: 14 }}>{getFieldValue('bookerName')}</span>
            </Form.Item>
          )}
        </Form.Item>

        {/* Hotel Stars */}
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

        <Form.Item
          label="Rooms"
          name="rooms"
          rules={[
            { required: true, message: 'Rooms required' },
            () => ({
              validator: (_, value) => {
                const paxCount = paxList?.length ?? 0;
                if (!value || value < paxCount) return Promise.resolve();
                return Promise.reject(
                  new Error(`Rooms must be less than or equal to total guests (${paxCount})`),
                );
              },
            }),
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Attachment"
          name="attachments"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          style={{ marginBottom: 16, marginLeft: 10 }}
        >
          <Upload />
        </Form.Item>
      </div>
    </>
  );
}
export default HotelForm;
