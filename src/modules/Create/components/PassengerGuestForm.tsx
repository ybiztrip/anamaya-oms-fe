import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  type FormInstance,
  Input,
  Row,
  Select,
  Space,
} from 'antd';
import { useMemo } from 'react';

import SelectPassenger from './SelectPassenger';

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

  return (
    <div className="space-y-4">
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
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name={[field.name, 'email']}
                      rules={[{ required: true, message: 'Email required' }]}
                    >
                      <SelectPassenger
                        showSearch
                        placeholder="Select Passenger"
                        onChange={(_, option) => {
                          const p = (option as any)?.passenger;
                          if (!p) return;

                          form.setFieldsValue({
                            paxList: {
                              [field.name]: {
                                email: p.email,
                                firstName: p.firstName,
                                lastName: p.lastName,
                                gender: p.gender,
                                phone: p.phoneNo,
                                dob: p.dateOfBirth,
                                idNumber: p.idNumber,
                                passportNumber: p.passportNumber,
                                passportExpiry: p.passportExpiry,
                              },
                            },
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item noStyle shouldUpdate={(prev, next) => prev?.paxList !== next?.paxList}>
                  {({ getFieldValue }) => {
                    const selectedEmail = getFieldValue(['paxList', field.name, 'email']);
                    if (!selectedEmail) return null;

                    return (
                      <Row gutter={[16, 8]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="First Name"
                            name={[field.name, 'firstName']}
                            rules={[{ required: true, message: 'First Name required' }]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Last Name"
                            name={[field.name, 'lastName']}
                            rules={[{ required: true, message: 'Last Name required' }]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Phone"
                            name={[field.name, 'phone']}
                            rules={[{ required: true, message: 'Phone required' }]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                          <Form.Item
                            label="Date of Birth"
                            name={[field.name, 'dob']}
                            // rules={[{ required: true, message: 'Date of Birth required' }]}
                          >
                            <DatePicker style={{ width: '100%' }} disabled />
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
                                { label: 'Male', value: 'male' },
                                { label: 'Female', value: 'female' },
                                { label: 'Other', value: 'other' },
                              ]}
                              disabled
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                          <Form.Item
                            label="ID#"
                            name={[field.name, 'idNumber']}
                            // rules={[{ required: true, message: 'ID# required' }]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item label="Passport" name={[field.name, 'passportNumber']}>
                            <Input disabled />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item label="Expiry Date" name={[field.name, 'passportExpiry']}>
                            <DatePicker style={{ width: '100%' }} disabled />
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
    </div>
  );
}
export default PassengerGuestForm;
