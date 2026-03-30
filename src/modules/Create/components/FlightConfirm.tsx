import { Card, Form, type FormInstance, Select, Space, Spin } from 'antd';
import { useEffect, useMemo } from 'react';

import { ADULT_TYPE, CHILD_TYPE } from '@/constants/common';
import type {
  BookingParamsType,
  BookingPriceItemType,
  FlightSearchOneWayType,
  PassengerGuestType,
} from '@/types';
import { formatIDR } from '@/utils/formatter';

import useFlightAddOns from '../hooks/useFlightAddOns';
import FlightInfo from './FlightInfo';

const FlightConfirm = ({
  form,
  index,
  flight,
  bookingParams,
  onPriceListChange,
}: {
  form: FormInstance;
  index: number;
  flight: FlightSearchOneWayType;
  bookingParams: BookingParamsType;
  onPriceListChange?: (prices: BookingPriceItemType[], flightIndex: number) => void;
}) => {
  const {
    data: addOns,
    isLoading,
    getBaggageById,
    getMealById,
  } = useFlightAddOns({ flightId: flight.flightId });

  const paxs = Form.useWatch(['flights', `flight-${index}`, 'paxs'], form); // reactive

  const priceList = useMemo<BookingPriceItemType[]>(() => {
    const prices: BookingPriceItemType[] = [];
    const flightName = bookingParams.flights?.[index]?.name;

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
        item: `Flight ${flightName} (Adult) x${totalAdult}`,
        currency: flightPrice?.currency ?? 'IDR',
        amount: Number(flightPrice?.amount ?? 0) * totalAdult,
      });
    }
    if (totalChild > 0) {
      const flightPrice =
        flight?.journeys?.[0]?.fareInfo?.partnerFare?.childFare?.totalFareWithCurrency;
      prices.push({
        item: `Flight ${flightName} (Child) x${totalChild}`,
        currency: flightPrice?.currency ?? 'IDR',
        amount: Number(flightPrice?.amount ?? 0) * totalChild,
      });
    }
    if (totalInfant > 0) {
      const flightPrice =
        flight?.journeys?.[0]?.fareInfo?.partnerFare?.infantFare?.totalFareWithCurrency;
      prices.push({
        item: `Flight ${flightName} (Infant) x${totalInfant}`,
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
      prices.push({
        item: `Flight ${flightName} Baggage`,
        currency: 'IDR',
        amount: totalBaggagePrice,
      });
    }
    if (totalMealPrice > 0) {
      prices.push({ item: `Flight ${flightName} Meal`, currency: 'IDR', amount: totalMealPrice });
    }

    return prices;
  }, [
    bookingParams.flights,
    bookingParams?.paxList,
    index,
    paxs,
    flight?.journeys,
    getBaggageById,
    getMealById,
  ]);

  useEffect(() => {
    onPriceListChange?.(priceList, index);
  }, [priceList, index, onPriceListChange]);

  return (
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
                        name={['flights', `flight-${index}`, 'paxs', `pax-${paxIndex}`, 'baggage']}
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
  );
};

export default FlightConfirm;
