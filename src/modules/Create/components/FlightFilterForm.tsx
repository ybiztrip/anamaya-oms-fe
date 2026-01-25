import { MinusOutlined, SwapOutlined, UploadOutlined } from '@ant-design/icons';
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

type TripType = 'roundTrip' | 'oneWay' | 'multiCity';

const airportOptions = [
  { value: 'CGK', label: 'CGK — Jakarta' },
  { value: 'DPS', label: 'DPS — Denpasar' },
];

function normFile(
  e: UploadProps['onChange'] extends (...args: any) => any
    ? Parameters<UploadProps['onChange']>[0]
    : any,
) {
  if (Array.isArray(e)) return e;
  return e?.fileList as UploadFile[];
}

function FlightFilterForm({
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

  return (
    <>
      <Card
        className="mt-4"
        title={
          <Space>
            <Button variant="link" size="large" color="primary">
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
        <Form.Item name="tripType">
          <Radio.Group
            options={[
              { label: 'Round-trip', value: 'roundTrip' },
              { label: 'One-way', value: 'oneWay' },
              { label: 'Multi City', value: 'multiCity' },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        {tripType !== 'multiCity' && (
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
        )}
        {tripType === 'multiCity' && (
          <Form.List name="segments" initialValue={[{}, {}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key}>
                    <Row gutter={[16, 8]} align="top" wrap>
                      <Col xs={24} md={16}>
                        <Space.Compact block>
                          <Form.Item
                            name={[field.name, 'origin']}
                            rules={[{ required: true, message: 'Origin required' }]}
                            style={{ flex: 1, marginBottom: 0 }}
                          >
                            <Select showSearch options={airportOptions} placeholder="From" />
                          </Form.Item>

                          <Button
                            icon={<SwapOutlined />}
                            onClick={() => {
                              const origin = form.getFieldValue(['segments', field.name, 'origin']);
                              const destination = form.getFieldValue([
                                'segments',
                                field.name,
                                'destination',
                              ]);
                              form.setFieldValue(['segments', field.name, 'origin'], destination);
                              form.setFieldValue(['segments', field.name, 'destination'], origin);
                            }}
                          />

                          <Form.Item
                            name={[field.name, 'destination']}
                            rules={[{ required: true, message: 'Destination required' }]}
                            style={{ flex: 1, marginBottom: 0 }}
                          >
                            <Select showSearch options={airportOptions} placeholder="To" />
                          </Form.Item>
                        </Space.Compact>
                      </Col>
                      <Col xs={24} md={8}>
                        <Space.Compact block>
                          <Form.Item
                            name={[field.name, 'departureDate']}
                            rules={[{ required: true, message: 'Departure date required' }]}
                            style={{ flex: 1, marginBottom: 0 }}
                          >
                            <DatePicker style={{ width: '100%' }} placeholder="Departure date" />
                          </Form.Item>

                          {fields.length > 1 && (
                            <Button icon={<MinusOutlined />} onClick={() => remove(field.name)} />
                          )}
                        </Space.Compact>
                      </Col>
                    </Row>
                  </div>
                ))}

                <Button className="mt-4" type="dashed" onClick={() => add({})}>
                  Add another flight
                </Button>
              </>
            )}
          </Form.List>
        )}
      </Card>
      <div className="space-y-4 mt-4">
        <Row gutter={[16, 8]}>
          <Col xs={24} md={8}>
            <Form.Item label="Booker" name="bookerName">
              <Input disabled />
            </Form.Item>
          </Col>

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
export default FlightFilterForm;
