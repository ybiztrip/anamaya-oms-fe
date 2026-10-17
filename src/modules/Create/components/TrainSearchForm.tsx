import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Spin } from 'antd';
import { useEffect, useMemo, useRef } from 'react';

import SectionCard from '@/components/SectionCard';
import SelectTrainStation from '@/components/Select/SelectTrainStation';
import { TRAIN_CLASS_OPTIONS } from '@/constants/common';
import useTravelPolicy from '@/hooks/useTravelPolicy';
import type { BookingParamsType, TrainJourneyType, TrainSegmentType } from '@/types';
import dayjs from '@/utils/dayjs';
import getTravelPolicyLimits from '@/utils/travelPolicyLimits';

import useTrainSearch from '../hooks/useTrainSearch';
import TrainInfo from './TrainInfo';

function TrainSearchForm({
  bookingParams,
  trainIndex,
  onSelectTrain,
  onSearchParamsChange,
}: Readonly<{
  bookingParams: BookingParamsType;
  trainIndex: number;
  onSelectTrain: (
    train: TrainJourneyType,
    segment: TrainSegmentType,
    trainIndex: number,
  ) => void;
  onSearchParamsChange?: (formValues: any) => void;
}>) {
  const [form] = Form.useForm();

  const { travelPoliciesById } = useTravelPolicy();

  const { trainParams, handleSearchTrains, data, isLoading } = useTrainSearch({
    bookingParams,
    trainIndex,
  });

  const autoSearchRef = useRef(false);
  useEffect(() => {
    if (autoSearchRef.current) return;

    if (trainParams?.origin && trainParams?.destination && trainParams?.departureDate) {
      form.submit();
      autoSearchRef.current = true;
    }
  }, [trainParams, form]);

  const policyLimits = useMemo(
    () => getTravelPolicyLimits(bookingParams?.paxList, travelPoliciesById),
    [bookingParams?.paxList, travelPoliciesById],
  );

  const sortBy = Form.useWatch('sortBy', form) ?? 'ARRIVAL_TIME';

  const trainClassOptions = useMemo(() => {
    // TODO: train class options
    return TRAIN_CLASS_OPTIONS;
    // if (!policyLimits) return FLIGHT_CLASS_OPTIONS;

    // return FLIGHT_CLASS_OPTIONS.filter((option) => {
    //   const rank = FLIGHT_CLASS_RANK[option.value];
    //   if (policyLimits.flightMinClass && rank < FLIGHT_CLASS_RANK[policyLimits.flightMinClass]) {
    //     return false;
    //   }
    //   if (policyLimits.flightMaxClass && rank > FLIGHT_CLASS_RANK[policyLimits.flightMaxClass]) {
    //     return false;
    //   }
    //   return true;
    // });
  }, [policyLimits]);

  const filteredResults = useMemo(() => {
    // TODO: filtered results
    const journeys = data?.data?.schedules?.flatMap((schedule) => schedule.journeys ?? []) ?? [];

    const items = journeys.flatMap((journey) => {
      if (policyLimits) {
        // TODO: filter by policy limits
      }

      return (journey.segments ?? []).map((segment) => ({ journey, segment }));
    });

    const parseMinutes = (time?: string) => {
      if (!time) return Number.POSITIVE_INFINITY;
      const [h, m] = time.split(':').map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) return Number.POSITIVE_INFINITY;
      return h * 60 + m;
    };

    const sortItems = (
      list: { journey: TrainJourneyType; segment: TrainSegmentType }[],
    ) =>
      [...list].sort((a, b) => {
        if (sortBy === 'PRICE') {
          return Number(a.segment.fare ?? 0) - Number(b.segment.fare ?? 0);
        }
        if (sortBy === 'DEPARTURE_TIME') {
          return parseMinutes(a.journey.departureTime) - parseMinutes(b.journey.departureTime);
        }
        return parseMinutes(a.journey.arrivalTime) - parseMinutes(b.journey.arrivalTime);
      });

    return [
      ...sortItems(items.filter(({ segment }) => segment.active)),
      ...sortItems(items.filter(({ segment }) => !segment.active)),
    ];
  }, [data?.data?.schedules, policyLimits, sortBy]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...trainParams,
        departureDate: dayjs(trainParams?.departureDate),
        sortBy: 'ARRIVAL_TIME',
      }}
      onFinish={async (values) => {
        onSearchParamsChange?.(values);
        await handleSearchTrains(values);
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
                      <SelectTrainStation placeholder="From" />
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
                      <SelectTrainStation placeholder="To" />
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
            />
          </Form.Item>
          <Form.Item label="Train Class" name="trainClass">
            <Select
              options={trainClassOptions}
              style={{ width: '180px' }}
              onChange={async () => {
                try {
                  await form.validateFields([
                    'origin',
                    'destination',
                    'departureDate',
                    'trainClass',
                  ]);

                  const values = form.getFieldsValue();
                  onSearchParamsChange?.(values);
                  form.submit();
                } catch {
                  // Don't auto-submit when required fields are incomplete.
                }
              }}
            />
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
                  <div className="text-gray-500">No trains found</div>
                </div>
              )}
              {filteredResults.map(({ journey, segment }) => {
                return (
                  <div
                    key={`${journey.journeyCode}-${segment.classKey}`}
                    className="overflow-x-auto"
                  >
                    <div style={{ minWidth: 800 }} className="mt-4 space-y-3">
                      <TrainInfo
                        train={journey}
                        segment={segment}
                        onSelect={(selectedTrain, selectedSegment) =>
                          onSelectTrain(selectedTrain, selectedSegment, trainIndex)
                        }
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

export default TrainSearchForm;
