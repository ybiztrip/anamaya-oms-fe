import { Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space, Spin } from 'antd';
import { useEffect, useMemo, useRef } from 'react';

import SectionCard from '@/components/SectionCard';
import SelectAirport from '@/components/Select/SelectAirport';
import { AIRLINE_CODES_WITH_POLICY_LIMITS } from '@/constants/common';
import useTravelPolicy from '@/hooks/useTravelPolicy';
import type { BookingParamsType, FlightSearchOneWayType } from '@/types';
import dayjs from '@/utils/dayjs';
import getTravelPolicyLimits from '@/utils/travelPolicyLimits';

import useFlightSearch from '../hooks/useFlightSearch';
import FlightInfo from './FlightInfo';

function FlightSearchForm({
  bookingParams,
  flightIndex,
  onSelectFlight,
  onSearchParamsChange,
}: {
  bookingParams: BookingParamsType;
  flightIndex: number;
  onSelectFlight: (flight: FlightSearchOneWayType, flightIndex: number) => void;
  onSearchParamsChange?: (formValues: any) => void;
}) {
  const [form] = Form.useForm();

  const { travelPoliciesById } = useTravelPolicy();

  const { flightParams, handleSearchFlights, data, isLoading } = useFlightSearch({
    bookingParams,
    flightIndex,
  });

  const isDirect = Form.useWatch('isDirect', form);
  const isFreeRefund = Form.useWatch('isFreeRefund', form);
  const isIncludeCheckedBaggage = Form.useWatch('isIncludeCheckedBaggage', form);
  const isMorningFlight = Form.useWatch('isMorningFlight', form);
  const isNoonFlight = Form.useWatch('isNoonFlight', form);
  const isEveningFlight = Form.useWatch('isEveningFlight', form);

  const autoSearchRef = useRef(false);
  useEffect(() => {
    if (autoSearchRef.current) return;

    if (flightParams?.origin && flightParams?.destination && flightParams?.departureDate) {
      form.submit();
      autoSearchRef.current = true;
    }
  }, [flightParams, form]);

  const policyLimits = useMemo(
    () => getTravelPolicyLimits(bookingParams?.paxList, travelPoliciesById),
    [bookingParams?.paxList, travelPoliciesById],
  );

  const filteredResults = useMemo(() => {
    const results = data?.data?.oneWayFlightSearchResults ?? [];

    const parseMinutes = (time?: string) => {
      if (!time) return null;
      const [h, m] = time.split(':').map((v) => Number(v));
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    };

    const hasCheckedBaggage = (fareInfo: any) => {
      const candidates = [
        fareInfo?.includedBaggage?.baggageWeight,
        fareInfo?.includedBaggage?.weight,
        fareInfo?.baggage?.baggageWeight,
        fareInfo?.baggage?.weight,
        fareInfo?.baggageAllowance?.baggageWeight,
        fareInfo?.baggageAllowance?.weight,
        fareInfo?.baggageAllowance?.pieces,
        fareInfo?.baggageAllowance?.quantity,
      ];
      const value = candidates.find((v) => v !== undefined && v !== null);
      if (value === undefined || value === null) return false;
      const num = Number(value);
      return !Number.isNaN(num) ? num > 0 : Boolean(value);
    };

    const hasTimeFilter = Boolean(isMorningFlight || isNoonFlight || isEveningFlight);

    return results.filter((flight: FlightSearchOneWayType) => {
      const journey = flight?.journeys?.[0];
      const marketingAirline = journey?.segments?.[0]?.marketingAirline;
      const numTransits = flight?.numOfTransits ?? journey?.numOfTransits;

      if (isDirect && String(numTransits) !== '0') return false;
      if (isFreeRefund && journey?.refundableStatus !== 'REFUNDABLE') return false;
      if (isIncludeCheckedBaggage && !hasCheckedBaggage(journey?.fareInfo)) return false;

      if (policyLimits) {
        const total =
          journey?.fareInfo?.partnerFare?.adultFare?.totalFareWithCurrency ??
          journey?.fareInfo?.airlineFare?.adultFare?.totalFareWithCurrency;
        const price = Number(total?.amount ?? 0);

        if (Number.isFinite(policyLimits.flightMinPrice) && price < policyLimits.flightMinPrice) {
          return false;
        }
        if (Number.isFinite(policyLimits.flightMaxPrice) && price > policyLimits.flightMaxPrice) {
          return false;
        }

        if (AIRLINE_CODES_WITH_POLICY_LIMITS.includes(marketingAirline)) {
          if (!policyLimits.flightIncludedAirlines.includes(marketingAirline)) {
            return false;
          }
        }
      }

      if (hasTimeFilter) {
        const minutes = parseMinutes(journey?.departureDetail?.departureTime);
        if (minutes === null) return false;
        const isMorning = minutes < 11 * 60;
        const isNoon = minutes >= 11 * 60 && minutes <= 16 * 60;
        const isEvening = minutes > 16 * 60;
        if (
          (isMorningFlight && isMorning) ||
          (isNoonFlight && isNoon) ||
          (isEveningFlight && isEvening)
        ) {
          return true;
        }
        return false;
      }

      return true;
    });
  }, [
    data?.data?.oneWayFlightSearchResults,
    isDirect,
    isFreeRefund,
    isIncludeCheckedBaggage,
    isMorningFlight,
    isNoonFlight,
    isEveningFlight,
    policyLimits,
  ]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...flightParams,
        departureDate: dayjs(flightParams?.departureDate),
        sortBy: 'ARRIVAL_TIME',
      }}
      onFinish={async (values) => {
        onSearchParamsChange?.(values);
        await handleSearchFlights(values);
      }}
    >
      <div className="sticky top-0 z-10 bg-white pb-3">
        <Row>
          <Col flex="300px"></Col>
          <Col flex="auto">
            <SectionCard className="mt-4">
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
                      <SelectAirport placeholder="From" />
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
                      <SelectAirport placeholder="To" />
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
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="Departure date"
                        disabledDate={(d) => d.isBefore(dayjs(), 'day')}
                        format="DD MMM YYYY"
                      />
                    </Form.Item>
                  </Space.Compact>
                </Col>
                <Col xs={24} md={4}>
                  <Button color="primary" variant="filled" htmlType="submit" block>
                    Search
                  </Button>
                </Col>
              </Row>
            </SectionCard>
          </Col>
        </Row>
      </div>
      <Row wrap={false}>
        <Col flex="300px" className="pr-8">
          <Form.Item className="mt-8" name="sortBy" label="Sort By">
            <Select
              placeholder="Sort By"
              options={[
                { label: 'Lowest Price', value: 'PRICE' },
                { label: 'Earliest Departure', value: 'DEPARTURE_TIME' },
                { label: 'Earliest Arrival', value: 'ARRIVAL_TIME' },
              ]}
              style={{ width: 'fit-content' }}
              onChange={async () => {
                try {
                  await form.validateFields(['origin', 'destination', 'departureDate']);
                  form.submit();
                } catch {
                  // Don't auto-submit when required fields are incomplete.
                }
              }}
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
          {/* TODO: filter codeshare */}
          {/* <Form.Item className="mb-0" name="isHideCodeshare" valuePropName="checked">
            <Checkbox>Hide codeshare</Checkbox>
          </Form.Item> */}
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
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin />
            </div>
          ) : (
            <>
              {data && filteredResults.length === 0 && (
                <div className="flex justify-center items-center h-full">
                  <div className="text-gray-500">No flights found</div>
                </div>
              )}
              {filteredResults.map((r: FlightSearchOneWayType) => {
                return (
                  <div className="overflow-x-auto">
                    <div style={{ minWidth: 800 }} className="mt-4 space-y-3">
                      <FlightInfo
                        key={r.flightId}
                        flight={r}
                        onSelect={() => onSelectFlight(r, flightIndex)}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </Col>
      </Row>
    </Form>
  );
}

export default FlightSearchForm;
