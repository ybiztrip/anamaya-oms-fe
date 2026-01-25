import { StarFilled, SwapOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  type FormInstance,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Upload,
  type UploadFile,
  type UploadProps,
} from 'antd';

const { RangePicker } = DatePicker;

type TripType = 'roundTrip' | 'oneWay';

const airportOptions = [
  { value: 'CGK', label: 'CGK — Jakarta' },
  { value: 'DPS', label: 'DPS — Denpasar' },
];

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

function FlightHotelFilterForm({
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

  const stayRange = Form.useWatch('stayRange', form);
  const nights = stayRange?.[0] && stayRange?.[1] ? stayRange[1].diff(stayRange[0], 'day') : 0;

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
              { label: 'Round-trip', value: 'roundTrip' },
              { label: 'One-way', value: 'oneWay' },
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
                <Select showSearch options={airportOptions} placeholder="From" />
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
                <Select showSearch options={airportOptions} placeholder="To" />
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
                <DatePicker style={{ width: '100%' }} placeholder="Departure date" />
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
              name="destination"
              label="Destination"
              style={{ flex: 1, marginBottom: 0 }}
              rules={[{ required: true, message: 'Origin required' }]}
            >
              <Select showSearch options={destinationOptions} placeholder="City, Hotel name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="stayRange" label="Check in - Check out" rules={[{ required: true }]}>
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {stayRange?.[0] && stayRange?.[1] && (
            <Col xs={24} md={8}>
              <div className="mt-8">{nights} nights</div>
            </Col>
          )}
        </Row>
      </Card>
      <div className="space-y-4 mt-4">
        <Row gutter={[16, 8]}>
          <Col xs={24} md={8}>
            <Form.Item label="Booker" name="bookerName">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 8]}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Flight Class"
              name="flightClass"
              rules={[{ required: true, message: 'Flight Class required' }]}
            >
              <Select
                options={[
                  { label: 'First Class', value: 'first' },
                  { label: 'Premium Economy', value: 'premiumEconomy' },
                  { label: 'Economy', value: 'economy' },
                  { label: 'Business', value: 'business' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={16}>
            <Form.Item
              label="Hotel Stars"
              name="hotelStars"
              rules={[{ required: true, message: 'Hotel Class required' }]}
            >
              <Radio.Group optionType="button" buttonStyle="solid">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Radio.Button key={n} value={String(n)}>
                    {Array.from({ length: n }).map((_, i) => (
                      <StarFilled key={i} style={{ color: '#fadb14' }} />
                    ))}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col xs={24} md={24}>
            <Form.Item
              label="Attachment"
              name="attachments"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload beforeUpload={() => false} multiple>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
}
export default FlightHotelFilterForm;
