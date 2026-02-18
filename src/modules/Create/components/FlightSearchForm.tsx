import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
} from 'antd';
import { useEffect, useRef } from 'react';

import SelectAirport from '@/components/Select/SelectAirport';
import type { BookingParamsType, FlightSearchOneWayType } from '@/types';
import dayjs from '@/utils/dayjs';

import useFlightSearch from '../hooks/useFlightSearch';
import FlightInfo from './FlightInfo';

function FlightSearchForm({
  bookingParams,
  flightIndex,
  onSelectFlight,
}: {
  bookingParams: BookingParamsType;
  flightIndex: number;
  onSelectFlight: (flight: FlightSearchOneWayType, flightIndex: number) => void;
}) {
  const [form] = Form.useForm();

  const { flightParams, handleSearchFlights, data, isLoading } = useFlightSearch({
    bookingParams,
    flightIndex,
  });

  const autoSearchRef = useRef(false);
  useEffect(() => {
    if (autoSearchRef.current) return;

    if (flightParams?.origin && flightParams?.destination && flightParams?.departureDate) {
      form.submit();
      autoSearchRef.current = true;
    }
  }, [flightParams, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...flightParams,
        departureDate: dayjs(flightParams?.departureDate),
        sortBy: 'ARRIVAL_TIME',
      }}
      onFinish={handleSearchFlights}
    >
      <Row>
        <Col flex="300px" className="pr-8">
          <Form.Item className="mt-8" name="sortBy" label="Sort By">
            <Select
              placeholder="Sort By"
              options={[
                { label: 'Lowest Price', value: 'LOWEST_PRICE' },
                { label: 'Earliest Departure', value: 'DEPARTURE_TIME' },
                { label: 'Earliest Arrival', value: 'ARRIVAL_TIME' },
              ]}
              style={{ width: 'fit-content' }}
            />
          </Form.Item>
          <Form.Item className="mb-0" name="isDirect" valuePropName="checked">
            <Checkbox>Direct</Checkbox>
          </Form.Item>
          <Form.Item className="mb-0" name="isFreeRefund" valuePropName="checked">
            <Checkbox>Include free refund & reschedule</Checkbox>
          </Form.Item>
          <Form.Item className="mb-0" name="isIncludeCheckedBaggage" valuePropName="checked">
            <Checkbox>Include checked baggage</Checkbox>
          </Form.Item>
          <Form.Item className="mb-0" name="isHideCodeshare" valuePropName="checked">
            <Checkbox>Hide codeshare</Checkbox>
          </Form.Item>
          <Form.Item className="mt-16 mb-0" name="isMorningFlight" valuePropName="checked">
            <Checkbox>Morning flight &lt; 11am</Checkbox>
          </Form.Item>
          <Form.Item className="mb-0" name="isNoonFlight" valuePropName="checked">
            <Checkbox>Noon flight 11am - 4pm</Checkbox>
          </Form.Item>
          <Form.Item className="mb-0" name="isEveningFlight" valuePropName="checked">
            <Checkbox>Evening flight &gt; 4pm</Checkbox>
          </Form.Item>
        </Col>
        <Col flex="auto">
          <Card
            className="mt-4"
            style={{
              border: 'none',
              boxShadow: 'none',
            }}
            styles={{
              body: {
                border: '1px #8BB9FF solid',
                borderRadius: 24,
                backgroundColor: '#fff',
                zIndex: 1,
                position: 'relative',
              },
            }}
          >
            {bookingParams?.tripType !== 'multiCity' && (
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
                              ? Promise.reject(
                                  new Error('Origin and destination cannot be the same'),
                                )
                              : Promise.resolve(),
                        }),
                      ]}
                    >
                      <SelectAirport showSearch placeholder="From" />
                    </Form.Item>
                    <Input
                      className="site-input-split"
                      style={{
                        width: 30,
                        borderInlineStart: 0,
                        borderInlineEnd: 0,
                        pointerEvents: 'none',
                      }}
                      placeholder="~"
                      disabled
                    />
                    <Form.Item
                      name="destination"
                      style={{ flex: 1, marginBottom: 0 }}
                      rules={[
                        { required: true, message: 'Destination required' },
                        ({ getFieldValue }) => ({
                          validator: (_, v) =>
                            v && v === getFieldValue('origin')
                              ? Promise.reject(
                                  new Error('Origin and destination cannot be the same'),
                                )
                              : Promise.resolve(),
                        }),
                      ]}
                    >
                      <SelectAirport showSearch placeholder="To" />
                    </Form.Item>
                  </Space.Compact>
                </Col>
                <Col xs={24} md={8}>
                  <Space.Compact block>
                    <Form.Item
                      name="departureDate"
                      rules={[{ required: true }]}
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <DatePicker style={{ width: '100%' }} placeholder="Departure date" />
                    </Form.Item>
                  </Space.Compact>
                </Col>
                <Col xs={24} md={4}>
                  <Button color="primary" variant="filled" htmlType="submit" block>
                    Search
                  </Button>
                </Col>
              </Row>
            )}
          </Card>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Spin />
              </div>
            ) : (
              <>
                {data?.data?.oneWayFlightSearchResults?.map((r: FlightSearchOneWayType) => {
                  return (
                    <FlightInfo
                      key={r.flightId}
                      flight={r}
                      onSelect={() => onSelectFlight(r, flightIndex)}
                    />
                  );
                })}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default FlightSearchForm;
