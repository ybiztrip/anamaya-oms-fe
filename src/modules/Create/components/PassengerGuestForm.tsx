import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, type FormInstance, Input, Radio, Row, Space } from 'antd';
import { useMemo } from 'react';

import SelectUser from '@/components/Select/SelectUser';
import EmployeeForm, { PassengerGuestFields } from '@/modules/Employee/components/EmployeeForm';
import type { UserType } from '@/types';
import dayjs from '@/utils/dayjs';
import { getPhoneParts } from '@/utils/phone';

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
    return 'Passenger/Guest';
  }, [type]);

  return (
    <div className="space-y-4">
      <Form.Item name="paxList" rules={[{ required: true, message: `Add minimum 1 ${paxTitle}` }]}>
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
                                  title: 'MR',
                                  firstName: '',
                                  lastName: '',
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

                                    const { phoneCode, phoneNumber } = getPhoneParts(
                                      u.phoneNo,
                                      u.countryCode,
                                    );

                                    form.setFieldsValue({
                                      paxList: {
                                        [field.name]: {
                                          id: u.id,
                                          email: u.email,
                                          title: u.title,
                                          firstName: u.firstName,
                                          lastName: u.lastName,
                                          phoneNumber: phoneNumber,
                                          phoneCode: phoneCode,
                                          dob: u.dateOfBirth
                                            ? dayjs(u.dateOfBirth, 'YYYY-MM-DD')
                                            : '',
                                          idNumber: u.identityNo,
                                          passportNumber: u.passportNo,
                                          passportExpiry: u.passportExpiry
                                            ? dayjs(u.passportExpiry, 'YYYY-MM-DD')
                                            : '',
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
                        <EmployeeForm
                          namePrefix={[field.name]}
                          fields={PassengerGuestFields}
                          disabledFields={sourceType === 'fromEmployee' ? PassengerGuestFields : []}
                        />
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
