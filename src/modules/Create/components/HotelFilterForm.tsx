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
  message,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { useState } from 'react';
import { Modal } from 'antd';


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

  /* STATE */
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'image' | 'pdf'>('image');
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')?.v?.email || '';
    } catch {
      return '';
    }
  });

  /* FUNCTIONS  */
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleUploadChange: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList);
  };

  const handlePreview = async (file: UploadFile) => {
    let previewUrl = file.url || file.preview;

    if (!previewUrl && file.originFileObj) {
      previewUrl = await getBase64(file.originFileObj as File);
      file.preview = previewUrl;
    }

    const isPdf =
      file.type === 'application/pdf' ||
      file.name?.toLowerCase().endsWith('.pdf');

    setPreviewType(isPdf ? 'pdf' : 'image');
    setPreviewImage(previewUrl as string);
    setPreviewOpen(true);
    setPreviewTitle(file.name || 'Preview');
  };

  const beforeUploadFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      message.error('Hanya dapat upload file gambar (JPG/PNG) atau PDF!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

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
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          style={{ paddingLeft: 30 }}
          labelCol={{
            xs: { span: 24 },
            sm: { span: 24 },
            md: { span: 8 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 24 },
            md: { span: 16 },
          }}
        >
          {/* Booker */}
          <Form.Item
            label="Booker"
            name="booker"
            rules={[{ required: true, message: 'Booker required' }]}
          >
            <span style={{ fontSize: 14 }}>
              {user}
            </span>
          </Form.Item>

          {/* Hotel Stars */}
          <Form.Item
            label="Hotel Star"
            name="hotelStars"
            rules={[{ required: true, message: 'Hotel Class required' }]}
          >
            <Radio.Group>
              <Space size={16} wrap>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Radio
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
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* Attachment */}
          <Form.Item
            label="Attachment"
            name="attachments"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            style={{ marginBottom: 16, marginLeft: 10 }}
          >
            <>
              <Upload
                beforeUpload={beforeUploadFile}
                multiple
                listType="picture" // penting untuk preview
                fileList={fileList}
                onChange={handleUploadChange}
                onPreview={handlePreview}
              >
                <span
                  style={{
                    color: '#1677ff',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  Upload
                </span>
              </Upload>

              {/* Modal Preview */}
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                width={800}
              >
                {previewType === 'image' ? (
                  <img
                    alt="preview"
                    style={{ width: '100%' }}
                    src={previewImage}
                  />
                ) : (
                  <iframe
                    src={previewImage}
                    style={{
                      width: '100%',
                      height: '80vh',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    title="PDF Preview"
                  />
                )}
              </Modal>
            </>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
export default HotelFilterForm;
