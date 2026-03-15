import { Card, Col, Form, type FormInstance, Row, Select, Space, Spin } from 'antd';
import { useMemo } from 'react';

import { ADULT_TYPE, CHILD_TYPE } from '@/constants/common';
import type { BookingParamsType, FlightSearchOneWayType, PassengerGuestType } from '@/types';
import { formatIDR } from '@/utils/formatter';

import useFlightAddOns from '../hooks/useFlightAddOns';
import FlightInfo from './FlightInfo';
import PriceDetail from './PriceDetail';

const FlightConfirm = ({
  form,
  index,
  flight,
  bookingParams,
}: {
  form: FormInstance;
  index: number;
  flight: FlightSearchOneWayType;
  bookingParams: BookingParamsType;
}) => {
  const {
    data: addOns,
    isLoading,
    getBaggageById,
    getMealById,
  } = useFlightAddOns({ flightId: flight.flightId });

  const paxs = Form.useWatch(['flights', `flight-${index}`, 'paxs'], form); // reactive

  const priceList = useMemo(() => {
    const prices: { item: string; currency: string; amount: number }[] = [];

    let totalAdult = 0;
    let totalChild = 0;
    let totalInfant = 0;
    bookingParams?.paxList?.forEach((pax: PassengerGuestType) => {
      if (pax?.type === ADULT_TYPE) {
        totalAdult++;
      } else if (pax?.type === CHILD_TYPE) {
        totalChild++;
      } else {
        totalInfant++;
      }
    });
    if (totalAdult > 0) {
      const flightPrice =
        flight?.journeys?.[0]?.fareInfo?.partnerFare?.adultFare?.totalFareWithCurrency;
      prices.push({
        item: `Flight (Adult) x${totalAdult}`,
        currency: flightPrice?.currency ?? 'IDR',
        amount: Number(flightPrice?.amount ?? 0) * totalAdult,
      });
    }
    if (totalChild > 0) {
      const flightPrice =
        flight?.journeys?.[0]?.fareInfo?.partnerFare?.childFare?.totalFareWithCurrency;
      prices.push({
        item: `Flight (Child) x${totalChild}`,
        currency: flightPrice?.currency ?? 'IDR',
        amount: Number(flightPrice?.amount ?? 0) * totalChild,
      });
    }
    if (totalInfant > 0) {
      const flightPrice =
        flight?.journeys?.[0]?.fareInfo?.partnerFare?.infantFare?.totalFareWithCurrency;
      prices.push({
        item: `Flight (Infant) x${totalInfant}`,
        currency: flightPrice?.currency ?? 'IDR',
        amount: Number(flightPrice?.amount ?? 0) * totalInfant,
      });
    }

    let totalBaggagePrice = 0;
    let totalMealPrice = 0;
    Object.values(paxs ?? {}).forEach((pax: any) => {
      if (pax.baggage) {
        const baggagePrice = getBaggageById(pax.baggage)?.priceWithCurrency?.amount ?? 0;
        totalBaggagePrice += Number(baggagePrice);
      }
      if (pax.meal) {
        const mealPrice = getMealById(pax.meal)?.priceWithCurrency?.amount ?? 0;
        totalMealPrice += Number(mealPrice);
      }
    });
    if (totalBaggagePrice > 0) {
      prices.push({ item: 'Baggage', currency: 'IDR', amount: totalBaggagePrice });
    }
    if (totalMealPrice > 0) {
      prices.push({ item: 'Meal', currency: 'IDR', amount: totalMealPrice });
    }

    return prices;
  }, [bookingParams?.paxList, paxs, flight?.journeys, getBaggageById, getMealById]);

  return (
    <Row gutter={[16, 8]}>
      <Col flex="auto">
        <Card size="small">
          <FlightInfo flight={flight} withSelect={false} withPrice={false} />
          {isLoading ? (
            <Spin />
          ) : (
            <div className="mt-4">
              <div className="text-lg font-semibold mb-2">Passengers</div>
              <Space direction="vertical">
                {bookingParams.paxList.map((pax, paxIndex) => (
                  <Card key={pax.id} size="small">
                    <Space size="large">
                      <div className="text-medium font-semibold">{`${pax.firstName} ${pax.lastName} (${pax.type})`}</div>
                      {addOns?.availableAddOnsOptions.baggageOptions &&
                        addOns?.availableAddOnsOptions.baggageOptions.length > 0 && (
                          <Form.Item
                            name={[
                              'flights',
                              `flight-${index}`,
                              'paxs',
                              `pax-${paxIndex}`,
                              'baggage',
                            ]}
                            label="Baggage"
                            rules={[{ required: true }]}
                            className="mb-0"
                            initialValue={addOns?.availableAddOnsOptions.baggageOptions?.[0]?.id}
                          >
                            <Select
                              placeholder="Baggage"
                              options={addOns?.availableAddOnsOptions.baggageOptions?.map(
                                (baggage) => ({
                                  label: `${baggage.baggageWeight} ${baggage.baggageType} (${baggage.priceWithCurrency.currency} ${formatIDR(baggage.priceWithCurrency.amount)})`,
                                  value: baggage.id,
                                  baggage,
                                }),
                              )}
                              style={{ width: '180px' }}
                            />
                          </Form.Item>
                        )}
                      {addOns?.availableAddOnsOptions.mealOptions &&
                        addOns?.availableAddOnsOptions.mealOptions.length > 0 && (
                          <Form.Item
                            name={['flights', `flight-${index}`, 'paxs', `pax-${paxIndex}`, 'meal']}
                            label="Meal"
                            rules={[{ required: true }]}
                            className="mb-0"
                            initialValue={addOns?.availableAddOnsOptions.mealOptions?.[0]?.id}
                          >
                            <Select
                              placeholder="Meal"
                              options={addOns?.availableAddOnsOptions.mealOptions?.map((meal) => ({
                                label: meal.mealName,
                                value: meal.id,
                                meal,
                              }))}
                              style={{ width: '180px' }}
                            />
                          </Form.Item>
                        )}
                    </Space>
                  </Card>
                ))}
              </Space>
            </div>
          )}
        </Card>
      </Col>
      <Col flex="400px">
        <PriceDetail prices={priceList} />
      </Col>
    </Row>
  );
};

export default FlightConfirm;
