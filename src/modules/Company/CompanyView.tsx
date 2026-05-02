import { Form, Switch } from 'antd';
import { useEffect, useRef } from 'react';

import Layout from '@/components/Layout';
import SectionCard from '@/components/SectionCard';

import { COMPANY_CONFIGS, COMPANY_CONFIGS_LABELS } from './constants';
import useCompany from './hooks/useCompany';

export default function ProfileView() {
  const { data, submitUpdate } = useCompany();
  const [form] = Form.useForm();
  const initialized = useRef(false);

  const configList = Object.values(COMPANY_CONFIGS);
  useEffect(() => {
    if (initialized.current) return;
    if (!data) return;
    const configs = data?.data ?? [];
    const items = configList.map((code) => {
      const config = configs.find((cfg) => cfg.code === code);
      return {
        code,
        valueBool: config?.valueBool ?? false,
      };
    });
    form.setFieldsValue({ items });
    initialized.current = true;
  }, [configList, data, form]);

  return (
    <Layout>
      <SectionCard className="mt-4" title="Company Configuration">
        <Form form={form} layout="horizontal" className="mt-4">
          {configList.map((code, index) => (
            <Form.Item
              key={code}
              label={COMPANY_CONFIGS_LABELS[code as keyof typeof COMPANY_CONFIGS_LABELS]}
              style={{ marginBottom: 16 }}
            >
              <Form.Item name={['items', index, 'valueBool']} valuePropName="checked" noStyle>
                <Switch
                  onChange={(checked) => {
                    form.setFieldValue(['items', index, 'valueBool'], checked);
                    submitUpdate(code, checked);
                  }}
                />
              </Form.Item>
            </Form.Item>
          ))}
        </Form>
      </SectionCard>
    </Layout>
  );
}
