import { Button, Form } from 'antd';
import { useEffect } from 'react';

import Layout from '@/components/Layout';
import SectionCard from '@/components/SectionCard';
import EmployeeForm, { ProfileFields } from '@/modules/Employee/components/EmployeeForm';
import type { UserType } from '@/types';
import dayjs from '@/utils/dayjs';
import { getPhoneParts } from '@/utils/phone';

import useProfile from './hooks/useProfile';

const buildPaxFromUser = (user?: UserType) => {
  const { phoneCode, phoneNumber } = getPhoneParts(user?.phoneNo, user?.countryCode);
  return {
    id: user?.id ?? 0,
    status: user?.status ?? 1,
    roles: user?.roles?.map((r) => r.roleId) ?? [],
    email: user?.email ?? '',
    title: user?.title ?? 'MR',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phoneNumber: phoneNumber ?? '',
    phoneCode: phoneCode ?? '+62',
    dob: user?.dateOfBirth ? dayjs(user.dateOfBirth, 'YYYY-MM-DD') : '',
    idNumber: user?.identityNo ?? '',
    passportNumber: user?.passportNo ?? '',
    passportExpiry: user?.passportExpiry ? dayjs(user.passportExpiry, 'YYYY-MM-DD') : '',
  };
};

export default function ProfileView() {
  const { data, isLoading, submitUpdate } = useProfile();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(buildPaxFromUser(data?.data));
  }, [data, form]);

  return (
    <Layout>
      <SectionCard className="mt-4" title="Profile">
        <Form form={form} layout="vertical" className="mt-4" onFinish={submitUpdate}>
          <EmployeeForm fields={ProfileFields} disabledFields={['email']} />
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Update
          </Button>
        </Form>
      </SectionCard>
    </Layout>
  );
}
