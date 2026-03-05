import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
} from 'antd';
import { getCountries, getCountryCallingCode, parsePhoneNumber } from 'libphonenumber-js';
import { useMemo } from 'react';

import type { UserType } from '@/types';
import dayjs from '@/utils/dayjs';

import SelectUser from '../../../components/Select/SelectUser';

function PassengerGuestForm({
  form,
  type,
}: {
  form: FormInstance;
  type: 'flight' | 'hotel' | 'flight-hotel';
}) {
  const paxTitle = useMemo(() => {
    if (type === 'flight') return 'Passenger';
    if (type === 'hotel') return 'Guest';
    return 'Passenger + Guest';
  }, [type]);

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
    <div className="space-y-4">
      <Form.Item name="paxList" rules={[{ required: true, message: 'Add minimum 1 passenger' }]}>
        <Form.List name="paxList">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, idx) => (
                <Card
                  key={field.key}
                  size="small"
                  style={{ marginBottom: 12, borderRadius: 16 }}
                  title={`${paxTitle} ${idx + 1}`}
                  extra={
                    fields.length > 1 ? (
                      <Button
                        danger
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      >
                        Remove
                      </Button>
                    ) : null
                  }
                >
                  <Row gutter={[16, 8]}>
                    <Col xs={24}>
                      <Form.Item name={[field.name, 'sourceType']} initialValue="fromEmployee">
                        <Radio.Group
                          options={[
                            { label: 'From Employee', value: 'fromEmployee' },
                            { label: 'Manual Input', value: 'manualInput' },
                          ]}
                          optionType="button"
                          buttonStyle="solid"
                          onChange={() => {
                            form.setFieldsValue({
                              paxList: {
                                [field.name]: {
                                  id: 0,
                                  email: '',
                                  firstName: '',
                                  lastName: '',
                                  gender: '',
                                  phoneNumber: '',
                                  phoneCode: '+62',
                                  dob: '',
                                  idNumber: '',
                                  passportNumber: '',
                                  passportExpiry: '',
                                },
                              },
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prev, next) => prev?.paxList !== next?.paxList}
                      >
                        {({ getFieldValue }) => {
                          const sourceType = getFieldValue(['paxList', field.name, 'sourceType']);
                          return (
                            <Form.Item
                              label="Email"
                              name={[field.name, 'email']}
                              rules={[{ required: true, message: 'Email required' }]}
                            >
                              {sourceType === 'fromEmployee' ? (
                                <SelectUser
                                  showSearch
                                  placeholder="Select Passenger"
                                  onChange={(_, option: any) => {
                                    const u = option.user as UserType;
                                    if (!u) return;

                                    const normalizedCountryCode = u.countryCode ?? '';
                                    const parsedPhone = u.phoneNo?.startsWith('+')
                                      ? parsePhoneNumber(u.phoneNo)
                                      : undefined;
                                    const phoneCode =
                                      normalizedCountryCode ||
                                      (parsedPhone?.countryCallingCode
                                        ? `+${parsedPhone.countryCallingCode}`
                                        : '+62');
                                    let phoneNumber = parsedPhone?.nationalNumber ?? u.phoneNo ?? '';
                                    if (normalizedCountryCode && u.phoneNo) {
                                      const rawCode = normalizedCountryCode.replace('+', '');
                                      phoneNumber = phoneNumber
                                        .replace(normalizedCountryCode, '')
                                        .replace(rawCode, '')
                                        .trim();
                                    }

                                    form.setFieldsValue({
                                      paxList: {
                                        [field.name]: {
                                          id: u.id,
                                          email: u.email,
                                          firstName: u.firstName,
                                          lastName: u.lastName,
                                          gender: u.gender,
                                          phoneNumber: phoneNumber,
                                          phoneCode: phoneCode,
                                          dob: u.dateOfBirth
                                            ? dayjs(u.dateOfBirth, 'YYYY-MM-DD')
                                            : '',
                                          idNumber: u.identityNo,
                                          passportNumber: u.passportNo,
                                          passportExpiry: u.passportExpiry,
                                        },
                                      },
                                    });
                                  }}
                                />
                              ) : (
                                <Input placeholder="Email" />
                              )}
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item noStyle shouldUpdate={(prev, next) => prev?.paxList !== next?.paxList}>
                    {({ getFieldValue }) => {
                      const sourceType = getFieldValue(['paxList', field.name, 'sourceType']);
                      const selectedEmail = getFieldValue(['paxList', field.name, 'email']);
                      if (sourceType === 'fromEmployee' && !selectedEmail) return null;

                      return (
                        <Row gutter={[16, 8]}>
                          <Col xs={24} md={12} hidden>
                            <Form.Item name={[field.name, 'id']}>
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item
                              label="First Name"
                              name={[field.name, 'firstName']}
                              rules={[{ required: true, message: 'First Name required' }]}
                            >
                              <Input disabled={sourceType === 'fromEmployee'} />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={12}>
                            <Form.Item
                              label="Last Name"
                              name={[field.name, 'lastName']}
                              rules={[{ required: true, message: 'Last Name required' }]}
                            >
                              <Input disabled={sourceType === 'fromEmployee'} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label="Phone" required>
                              <Space.Compact block>
                                <Form.Item
                                  name={[field.name, 'phoneCode']}
                                  noStyle
                                  initialValue="+62"
                                >
                                  <Select
                                    style={{ width: 130 }}
                                    options={phoneCodeOptions}
                                    disabled={sourceType === 'fromEmployee'}
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={[field.name, 'phoneNumber']}
                                  noStyle
                                  rules={[{ required: true, message: 'Phone required' }]}
                                >
                                  <Input disabled={sourceType === 'fromEmployee'} />
                                </Form.Item>
                              </Space.Compact>
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item
                              label="Date of Birth"
                              name={[field.name, 'dob']}
                              // rules={[{ required: true, message: 'Date of Birth required' }]}
                            >
                              <DatePicker
                                style={{ width: '100%' }}
                                format="DD MMM YYYY"
                                disabled={sourceType === 'fromEmployee'}
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item
                              label="Gender"
                              name={[field.name, 'gender']}
                              rules={[{ required: true, message: 'Gender required' }]}
                            >
                              <Select
                                options={[
                                  { label: 'Male', value: 'MALE' },
                                  { label: 'Female', value: 'FEMALE' },
                                ]}
                                disabled={sourceType === 'fromEmployee'}
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item
                              label="ID#"
                              name={[field.name, 'idNumber']}
                              // rules={[{ required: true, message: 'ID# required' }]}
                            >
                              <Input disabled={sourceType === 'fromEmployee'} />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={12}>
                            <Form.Item label="Passport" name={[field.name, 'passportNumber']}>
                              <Input disabled={sourceType === 'fromEmployee'} />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={12}>
                            <Form.Item label="Expiry Date" name={[field.name, 'passportExpiry']}>
                              <DatePicker
                                style={{ width: '100%' }}
                                disabled={sourceType === 'fromEmployee'}
                                format="DD MMM YYYY"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      );
                    }}
                  </Form.Item>
                </Card>
              ))}

              <Space>
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({})}>
                  Add {paxTitle}
                </Button>
              </Space>
            </>
          )}
        </Form.List>
      </Form.Item>
    </div>
  );
}
export default PassengerGuestForm;
