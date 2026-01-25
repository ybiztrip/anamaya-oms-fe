import { StarFilled, UploadOutlined } from '@ant-design/icons';
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

function HotelFilterForm({
  form,
  onTypeChange,
}: {
  form: FormInstance;
  onTypeChange: (key: string) => void;
}) {
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
export default HotelFilterForm;
