import { message, Modal, Upload, type UploadFile, type UploadProps } from 'antd';
import { useState } from 'react';

function UploadComponent({ ...props }: UploadProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'image' | 'pdf'>('image');
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

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

    const isPdf = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');

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
      <Upload
        beforeUpload={beforeUploadFile}
        multiple
        listType="picture" // penting untuk preview
        fileList={fileList}
        onChange={handleUploadChange}
        onPreview={handlePreview}
        {...props}
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

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width={800}
      >
        {previewType === 'image' ? (
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
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
  );
}
export default UploadComponent;
