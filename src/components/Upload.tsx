import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Upload, type UploadFile, type UploadProps } from 'antd';
import { useState } from 'react';

import { documentUpload } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';

type UploadFileProps = UploadProps & {
  initialValue?: any;
};

function UploadComponent({ onRemove, onChange, ...props }: UploadFileProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>(props.initialValue || []);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | 'other'>('image');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState('');

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const upload = async ({ file, onError, onSuccess, onProgress }: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      formData.append('file', file, sanitizedName);
      formData.append('type', 'ATTACHMENT_BOOKING');

      const result = await documentUpload(formData, {
        onUploadProgress: ({ loaded, total }) => {
          onProgress({ percent: Math.round((loaded / Number(total)) * 100) });
        },
      });
      file.status = 'done';
      file.url = result.data.response;
      file.response = result.data;
      onSuccess(result.data, file);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      file.status = 'error';
      message.error(DEFAULT_ERROR_MESSAGE);
      setIsLoading(false);
      onError(err);
    }
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newList }: any) => {
    setFileList(newList);
    if (onChange) onChange(newList);
  };

  const handleRemove: UploadProps['onRemove'] = (file) => {
    const result = onRemove?.(file);
    if (result === false) return false;
    if (result && typeof (result as Promise<boolean>).then === 'function') {
      return (result as Promise<boolean>).then((value) => {
        if (value === false) return false;
        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
        return true;
      });
    }
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    return true;
  };

  const handlePreview = async (file: UploadFile) => {
    let previewUrl = file.url || file.preview;

    if (!previewUrl && file.originFileObj) {
      previewUrl = await getBase64(file.originFileObj as File);
      file.preview = previewUrl;
    }

    const fileName = file.name?.toLowerCase() ?? '';
    const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');
    const fileType = file.type ?? '';
    const isImage = fileType.startsWith('image/');

    setPreviewType(isPdf ? 'pdf' : isImage ? 'image' : 'other');
    setPreviewImage(previewUrl as string);
    setPreviewOpen(true);
    setPreviewTitle(file.name || 'Preview');
  };

  const validateFile = (file: File) => {
    const fileName = file.name?.toLowerCase() ?? '';
    const fileType = file.type ?? '';
    const isImage = fileType.startsWith('image/');
    const isPdf = fileType === 'application/pdf';
    const isDoc =
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx');
    const isXls =
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileName.endsWith('.xls') ||
      fileName.endsWith('.xlsx');

    if (!isImage && !isPdf && !isDoc && !isXls) {
      message.error('Only image, PDF, DOC, or XLS files can be uploaded!');
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Maximum file size is 5 MB!');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  return (
    <>
      <Upload
        beforeUpload={validateFile}
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        listType="picture"
        fileList={fileList}
        onChange={handleUploadChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
        customRequest={upload}
        {...props}
      >
        <Button icon={<UploadOutlined />} loading={isLoading}>
          Upload
        </Button>
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
        ) : previewType === 'pdf' ? (
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
        ) : (
          <div>
            <a href={previewImage} download>
              Download file
            </a>
          </div>
        )}
      </Modal>
    </>
  );
}
export default UploadComponent;
