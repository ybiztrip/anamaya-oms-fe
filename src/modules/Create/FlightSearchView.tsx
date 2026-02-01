import { ArrowLeftOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import SelectAirport from '@/components/Select/SelectAirport';
import { CREATE_PATH } from '@/constants/routePath';
import useFlightAirlines from '@/hooks/useFlightAirlines';
import type { FlightSearchOneWayType } from '@/types';
import { formatDuration, formatIDR } from '@/utils/formatter';

import useFlightSearch from './hooks/useFlightSearch';

function FlightSearchView() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { airlinesByCode } = useFlightAirlines();

  const { flightSearchParams, handleSearchFlights, handleSelectFlight, data } = useFlightSearch();

  const depart = Form.useWatch('departureDate', form);

  const onSwap = () => {
    const origin = form.getFieldValue('origin');
    const destination = form.getFieldValue('destination');
    form.setFieldsValue({ origin: destination, destination: origin });
  };

  useEffect(() => {
    if (!flightSearchParams) {
      navigate(CREATE_PATH);
    }
  }, [flightSearchParams, navigate]);

  return (
    <Layout withSidebar={false}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...flightSearchParams,
          departureDate: dayjs(flightSearchParams?.departureDate),
          returnDate: dayjs(flightSearchParams?.returnDate),
          sortBy: 'ARRIVAL_TIME',
        }}
        onFinish={handleSearchFlights}
      >
        <Row>
          <Col flex="300px" className="pr-8">
            <Button
              className="mt-10"
              color="primary"
              variant="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(CREATE_PATH)}
            >
              Back
            </Button>
            <Form.Item className="mt-16" name="sortBy" label="Sort By">
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
              {flightSearchParams?.tripType !== 'multiCity' && (
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

                      <Button onClick={onSwap} icon={<SwapOutlined />} />

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
                      {flightSearchParams?.tripType === 'roundTrip' && (
                        <>
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
                            name="returnDate"
                            rules={[
                              { required: true, message: 'Return date required for round-trip' },
                            ]}
                            style={{ flex: 1, marginBottom: 0 }}
                          >
                            <DatePicker
                              style={{ width: '100%' }}
                              placeholder="Return date"
                              disabledDate={(d) => (depart ? d.isBefore(depart, 'day') : false)}
                            />
                          </Form.Item>
                        </>
                      )}
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
              {data?.data?.oneWayFlightSearchResults?.map((r: FlightSearchOneWayType) => {
                const journey = r?.journeys?.[0];
                const seg0 = journey?.segments?.[0];

                const airlineCode = seg0?.marketingAirline;
                const airline = airlineCode ? (airlinesByCode as any)[airlineCode] : undefined;

                const dep = journey?.departureDetail;
                const arr = journey?.arrivalDetail;

                const total =
                  journey?.fareInfo?.partnerFare?.adultFare?.totalFareWithCurrency ??
                  journey?.fareInfo?.airlineFare?.adultFare?.totalFareWithCurrency;

                const depTerminal = dep?.departureTerminal ? `T${dep.departureTerminal}` : '-';
                const arrTerminal = arr?.arrivalTerminal ? `T${arr.arrivalTerminal}` : '-';

                return (
                  <Card key={r.flightId} size="small">
                    <Row align="middle" gutter={16} wrap={false}>
                      <Col flex="220px">
                        <div className="flex items-center gap-3">
                          {airline?.logoUrl ? (
                            <img
                              src={airline.logoUrl}
                              alt={airline.airlineName ?? airlineCode}
                              style={{ height: 24 }}
                            />
                          ) : (
                            <div style={{ width: 24, height: 24 }} />
                          )}
                          <div>
                            <div className="font-medium">
                              {airline?.airlineName ?? airlineCode ?? 'Unknown airline'}
                            </div>
                            <div className="text-xs text-gray-500">{seg0?.flightCode}</div>
                          </div>
                        </div>
                        {/* TODO: add flight add-ons */}
                      </Col>

                      <Col flex="auto">
                        <div className="grid grid-cols-[4rem_auto_4rem] items-center justify-stretch">
                          <div>
                            <div className="text-lg font-semibold">{dep?.departureTime ?? '-'}</div>
                            <div className="text-xs text-gray-500">
                              {dep?.airportCode ?? '-'} {depTerminal}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm">
                              {formatDuration(journey?.journeyDuration)}
                            </div>
                            <div className="border-t-4 border-gray-200 my-2" />
                            <div className="text-xs text-gray-500">
                              {r?.numOfTransits === '0' ? 'Nonstop' : `${r?.numOfTransits} transit`}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-semibold">{arr?.arrivalTime ?? '-'}</div>
                            <div className="text-xs text-gray-500">
                              {arr?.airportCode ?? '-'} {arrTerminal}
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col flex="220px" className="text-right">
                        <div className="text-lg font-semibold">
                          {total?.currency ?? 'IDR'} {formatIDR(total?.amount)}
                        </div>
                      </Col>
                      <Col flex="220px" className="text-right">
                        <Button
                          type="primary"
                          className="mt-2"
                          onClick={() => handleSelectFlight(r)}
                        >
                          Select
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </div>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
}
export default FlightSearchView;
