import { Col, DatePicker, Divider, Form, Input, Row, Select, Space, Typography } from 'antd';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { useMemo } from 'react';

import SelectRole from '@/components/Select/SelectRole';
import SelectTravelPolicy from '@/components/Select/SelectTravelPolicy';

export type EmployeeFieldKey =
  | 'id'
  | 'status'
  | 'email'
  | 'password'
  | 'roles'
  | 'travelPolicy'
  | 'title'
  | 'firstName'
  | 'lastName'
  | 'phoneCode'
  | 'phoneNumber'
  | 'dob'
  | 'idNumber'
  | 'passportNumber'
  | 'passportExpiry';

// eslint-disable-next-line react-refresh/only-export-components
export const CreateEmployeeFields: EmployeeFieldKey[] = [
  'email',
  'password',
  'roles',
  'travelPolicy',
  'title',
  'firstName',
  'lastName',
  'phoneCode',
  'phoneNumber',
  'dob',
  'idNumber',
  'passportNumber',
  'passportExpiry',
];
// eslint-disable-next-line react-refresh/only-export-components
export const UpdateEmployeeFields: EmployeeFieldKey[] = [
  'id',
  'status',
  'email',
  'roles',
  'travelPolicy',
  'title',
  'firstName',
  'lastName',
  'phoneCode',
  'phoneNumber',
  'dob',
  'idNumber',
  'passportNumber',
  'passportExpiry',
];
// eslint-disable-next-line react-refresh/only-export-components
export const PassengerGuestFields: EmployeeFieldKey[] = [
  'id',
  'title',
  'firstName',
  'lastName',
  'phoneCode',
  'phoneNumber',
  'dob',
  'idNumber',
  'passportNumber',
  'passportExpiry',
];
// eslint-disable-next-line react-refresh/only-export-components
export const ProfileFields: EmployeeFieldKey[] = [
  'email',
  'title',
  'firstName',
  'lastName',
  'phoneCode',
  'phoneNumber',
  'dob',
  'idNumber',
  'passportNumber',
  'passportExpiry',
];

export default function EmployeeForm({
  namePrefix = [],
  fields = [],
  disabledFields = [],
}: {
  namePrefix?: string[] | number[];
  fields?: EmployeeFieldKey[];
  disabledFields?: EmployeeFieldKey[];
}) {
  const phoneCodeOptions = useMemo(
    () =>
      getCountries().map((country) => {
        const code = `+${getCountryCallingCode(country)}`;
        return {
          label: `${country} (${code})`,
          value: code,
        };
      }),
    [],
  );

  return (
    <div>
      <section>
        <Row gutter={[16, 8]}>
          {fields.includes('id') && (
            <Col xs={24} hidden>
              <Form.Item name={[...namePrefix, 'id']}>
                <Input />
              </Form.Item>
            </Col>
          )}
          {fields.includes('status') && (
            <Col xs={24} md={12}>
              <Form.Item label="Status" name={[...namePrefix, 'status']}>
                <Select
                  placeholder="Select Status"
                  options={[
                    { label: 'Active', value: 1 },
                    { label: 'Inactive', value: 0 },
                  ]}
                  disabled={disabledFields.includes('status')}
                />
              </Form.Item>
            </Col>
          )}
          {fields.includes('roles') && (
            <Col xs={24} md={12}>
              <Form.Item
                label="Roles"
                name={[...namePrefix, 'roles']}
                rules={[{ required: true, message: 'Roles required' }]}
              >
                <SelectRole
                  placeholder="Select Roles"
                  disabled={disabledFields.includes('roles')}
                  mode="multiple"
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={[16, 8]}>
          {fields.includes('email') && (
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name={[...namePrefix, 'email']}
                rules={[{ required: true, message: 'Email required' }]}
              >
                <Input placeholder="Email" disabled={disabledFields.includes('email')} />
              </Form.Item>
            </Col>
          )}
          {fields.includes('password') && (
            <Col xs={24} md={12}>
              <Form.Item
                label="Password"
                name={[...namePrefix, 'password']}
                rules={[{ required: true, message: 'Password required' }]}
              >
                <Input.Password
                  placeholder="Password"
                  disabled={disabledFields.includes('password')}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={[16, 8]}>
          {fields.includes('travelPolicy') && (
            <Col xs={24} md={12}>
              <Form.Item
                label="Travel Policy"
                name={[...namePrefix, 'travelPolicy']}
                rules={[{ required: true, message: 'Travel Policy required' }]}
              >
                <SelectTravelPolicy placeholder="Select Travel Policy" disabled={disabledFields.includes('travelPolicy')} />
              </Form.Item>
            </Col>
          )}
        </Row>
      </section>

      <section>
        <Typography.Title level={5}>Basic Info</Typography.Title>
        <Divider className="my-2" />
        <Row gutter={[16, 8]} className="mt-4">
          {fields.includes('title') && (
            <Col xs={24}>
              <Form.Item
                label="Title"
                name={[...namePrefix, 'title']}
                rules={[{ required: true, message: 'Title required' }]}
              >
                <Select
                  placeholder="Select Title"
                  options={[
                    { label: 'Mr', value: 'MR' },
                    { label: 'Mrs', value: 'MRS' },
                    { label: 'Ms', value: 'MS' },
                  ]}
                  disabled={disabledFields.includes('title')}
                  style={{ width: '100px' }}
                />
              </Form.Item>
            </Col>
          )}
          {fields.includes('firstName') && (
            <Col xs={24} md={12}>
              <Form.Item
                label="First Name"
                name={[...namePrefix, 'firstName']}
                rules={[{ required: true, message: 'First Name required' }]}
              >
                <Input placeholder="First Name" disabled={disabledFields.includes('firstName')} />
              </Form.Item>
            </Col>
          )}
          {fields.includes('lastName') && (
            <Col xs={24} md={12}>
              <Form.Item
                label="Last Name"
                name={[...namePrefix, 'lastName']}
                rules={[{ required: true, message: 'Last Name required' }]}
              >
                <Input placeholder="Last Name" disabled={disabledFields.includes('lastName')} />
              </Form.Item>
            </Col>
          )}
          {fields.includes('phoneCode') && (
            <Col xs={24} md={12}>
              <Form.Item label="Phone" required>
                <Space.Compact block>
                  <Form.Item
                    name={[...namePrefix, 'phoneCode']}
                    noStyle
                    initialValue="+62"
                    rules={[{ required: true, message: 'Phone Code required' }]}
                  >
                    <Select
                      style={{ width: 130 }}
                      options={phoneCodeOptions}
                      disabled={disabledFields.includes('phoneCode')}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[...namePrefix, 'phoneNumber']}
                    noStyle
                    rules={[{ required: true, message: 'Phone Number required' }]}
                  >
                    <Input
                      placeholder="Phone Number"
                      disabled={disabledFields.includes('phoneNumber')}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          )}
          {fields.includes('dob') && (
            <Col xs={24} md={12}>
              <Form.Item
                label="Date of Birth"
                name={[...namePrefix, 'dob']}
                rules={[{ required: true, message: 'Date of Birth required' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD MMM YYYY"
                  disabled={disabledFields.includes('dob')}
                />
              </Form.Item>
            </Col>
          )}
          {fields.includes('idNumber') && (
            <Col xs={24} md={12}>
              <Form.Item label="ID#" name={[...namePrefix, 'idNumber']}>
                <Input placeholder="ID Number" disabled={disabledFields.includes('idNumber')} />
              </Form.Item>
            </Col>
          )}
        </Row>
      </section>

      <section>
        <Typography.Title level={5}>Passport Info</Typography.Title>
        <Divider className="my-2" />
        <Row gutter={[16, 8]} className="mt-4">
          {fields.includes('passportNumber') && (
            <Col xs={24} md={12}>
              <Form.Item label="Passport" name={[...namePrefix, 'passportNumber']}>
                <Input
                  placeholder="Passport Number"
                  disabled={disabledFields.includes('passportNumber')}
                />
              </Form.Item>
            </Col>
          )}
          {fields.includes('passportExpiry') && (
            <Col xs={24} md={12}>
              <Form.Item label="Expiry Date" name={[...namePrefix, 'passportExpiry']}>
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={disabledFields.includes('passportExpiry')}
                  format="DD MMM YYYY"
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </section>
    </div>
  );
}
