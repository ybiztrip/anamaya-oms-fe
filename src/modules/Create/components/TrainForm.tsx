import { SwapOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  type FormInstance,
  Row,
  Select,
  Space,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { useEffect, useMemo } from 'react';

import SectionCard from '@/components/SectionCard';
import SelectTrainStation from '@/components/Select/SelectTrainStation';
import Upload from '@/components/Upload';
import { BOOKING_TYPE_TRAIN, TRAIN_CLASS_OPTIONS } from '@/constants/common';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import useTravelPolicy from '@/hooks/useTravelPolicy';
import type { BookingParamsType, BookingTypeType } from '@/types';
import dayjs from '@/utils/dayjs';
import { sessionStorageGet } from '@/utils/sessionStorage';
import getTravelPolicyLimits from '@/utils/travelPolicyLimits';

import { bookingParamsToTrainForm } from '../utils/bookingFormMapper';
import BookingTypeTabs from './BookingTypeTabs';

function normFile(
  e: UploadProps['onChange'] extends (...args: any) => any
    ? Parameters<UploadProps['onChange']>[0]
    : any,
) {
  if (Array.isArray(e)) return e;
  return e?.fileList as UploadFile[];
}

function TrainForm({
  form,
  onTypeChange,
}: {
  form: FormInstance;
  onTypeChange: (key: BookingTypeType) => void;
}) {
  const watchedPaxList = Form.useWatch('paxList', form);
  const paxList = useMemo(() => watchedPaxList ?? [], [watchedPaxList]);
  const { travelPoliciesById } = useTravelPolicy();

  const onSwap = () => {
    const origin = form.getFieldValue('origin');
    const destination = form.getFieldValue('destination');
    form.setFieldsValue({ origin: destination, destination: origin });
  };

  const policyLimits = useMemo(
    () => getTravelPolicyLimits(paxList, travelPoliciesById),
    [paxList, travelPoliciesById],
  );

  const trainClassOptions = useMemo(() => {
    return TRAIN_CLASS_OPTIONS;
    // TODO: Implement train class by policy limits

    // if (!policyLimits) return TRAIN_CLASS_OPTIONS;

    // return TRAIN_CLASS_OPTIONS.filter((option) => {
    //   const rank = TRAIN_CLASS_RANK[option.value];
    //   if (policyLimits.trainMinClass && rank < TRAIN_CLASS_RANK[policyLimits.trainMinClass]) {
    //     return false;
    //   }
    //   if (policyLimits.trainMaxClass && rank > TRAIN_CLASS_RANK[policyLimits.trainMaxClass]) {
    //     return false;
    //   }
    //   return true;
    // });
  }, [policyLimits]);

  useEffect(() => {
    const bookingParams = sessionStorageGet<BookingParamsType>(BOOKING_PARAMS);
    if (bookingParams) {
      const trainForm = bookingParamsToTrainForm(bookingParams);
      form.setFieldsValue(trainForm);
    }
  }, [form]);

  useEffect(() => {
    if (!trainClassOptions.length) return;
    const currentClass = form.getFieldValue('trainClass');
    if (!trainClassOptions.some((option) => option.value === currentClass)) {
      form.setFieldValue('trainClass', trainClassOptions[0].value);
    }
  }, [trainClassOptions, form]);

  return (
    <>
      <SectionCard
        className="mt-4"
        title={<BookingTypeTabs activeType={BOOKING_TYPE_TRAIN} onChange={onTypeChange} />}
      >
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
                <SelectTrainStation placeholder="From" />
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
                <SelectTrainStation placeholder="To" />
              </Form.Item>
            </Space.Compact>
          </Col>
          <Col xs={24} md={12}>
            <Space.Compact block>
              <Form.Item
                name="departureDate"
                rules={[{ required: true, message: 'Departure date required' }]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Departure date"
                  format="DD MMM YYYY"
                  disabledDate={(d) => d.isBefore(dayjs(), 'day')}
                />
              </Form.Item>
            </Space.Compact>
          </Col>
        </Row>
      </SectionCard>
      <div className="space-y-4 mt-4">
        <Form.Item noStyle shouldUpdate={true}>
          {({ getFieldValue }) => (
            <Form.Item
              label="Booker"
              name="bookerName"
              layout="horizontal"
              rules={[{ required: true, message: 'Booker required' }]}
            >
              <span style={{ fontSize: 14 }}>{getFieldValue('bookerName')}</span>
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item
          label="Train Class"
          name="trainClass"
          rules={[{ required: true, message: 'Train Class required' }]}
          style={{ width: '300px' }}
        >
          <Select options={trainClassOptions} />
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

export default TrainForm;
