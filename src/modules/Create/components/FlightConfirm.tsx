import { Card, Form, type FormInstance, Select, Space, Spin } from 'antd';
import { useEffect, useMemo } from 'react';

import { ADULT_TYPE, CHILD_TYPE } from '@/constants/common';
import type {
  BookingParamsType,
  BookingPriceItemType,
  FlightJourneySegmentType,
  FlightJourneyType,
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
    data: flightAddOns,
    isLoading,
    getBaggageById,
    getMealById,
  } = useFlightAddOns({ flightId: flight.flightId });

  const flightValues = Form.useWatch(['flights', `flight-${index}`], form); // reactive

  const flightsBasedOnAddOns = useMemo(() => {
    return flight?.journeys?.flatMap((journey: FlightJourneyType, journeyIndex: number) => {
      const addOns = flightAddOns?.journeysWithAvailableAddOnsOptions?.[journeyIndex];
      if (addOns?.availableAddOnsOptions !== null) {
        return {
          ...flight,
          numOfTransits: journey.numOfTransits,
          tripDuration: journey.journeyDuration,
          journeys: [journey],
          addOns: addOns?.availableAddOnsOptions,
        } as FlightSearchOneWayType;
      } else if (addOns?.segmentsWithAvailableAddOns?.length > 0) {
        return flight.journeys[journeyIndex].segments.map(
          (segment: FlightJourneySegmentType, segmentIndex: number) => {
            return {
              ...flight,
              numOfTransits: '0',
              tripDuration: segment.flightDurationInMinutes,
              journeys: [
                {
                  ...flight.journeys[journeyIndex],
                  journeyDuration: segment.flightDurationInMinutes,
                  departureDetail: segment.departureDetail,
                  arrivalDetail: segment.arrivalDetail,
                  segments: [segment],
                },
              ],
              addOns: addOns?.segmentsWithAvailableAddOns?.[segmentIndex]?.availableAddOnsOptions,
            };
          },
        );
      }
      return {
        ...flight,
        journeys: [flight.journeys[journeyIndex]],
      } as FlightSearchOneWayType;
    });
  }, [flightAddOns, flight]);

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
        flight?.journeys?.reduce((acc: number, journey: FlightJourneyType) => {
          return (
            acc +
            Number(journey?.fareInfo?.partnerFare?.adultFare?.totalFareWithCurrency?.amount ?? 0)
          );
        }, 0) ?? 0;
      prices.push({
        item: `Flight ${flightName} (Adult) x${totalAdult}`,
        currency: 'IDR',
        amount: flightPrice * totalAdult,
      });
    }
    if (totalChild > 0) {
      const flightPrice =
        flight?.journeys?.reduce((acc: number, journey: FlightJourneyType) => {
          return (
            acc +
            Number(journey?.fareInfo?.partnerFare?.childFare?.totalFareWithCurrency?.amount ?? 0)
          );
        }, 0) ?? 0;
      prices.push({
        item: `Flight ${flightName} (Child) x${totalChild}`,
        currency: 'IDR',
        amount: flightPrice * totalChild,
      });
    }
    if (totalInfant > 0) {
      const flightPrice =
        flight?.journeys?.reduce((acc: number, journey: FlightJourneyType) => {
          return (
            acc +
            Number(journey?.fareInfo?.partnerFare?.infantFare?.totalFareWithCurrency?.amount ?? 0)
          );
        }, 0) ?? 0;
      prices.push({
        item: `Flight ${flightName} (Infant) x${totalInfant}`,
        currency: 'IDR',
        amount: flightPrice * totalInfant,
      });
    }

    let totalBaggagePrice = 0;
    let totalMealPrice = 0;
    Object.values(flightValues ?? {}).forEach((flightAddOns: any, flightAddOnsIndex: number) => {
      Object.values(flightAddOns?.paxs ?? {}).forEach((pax: any) => {
        if (pax.baggage) {
          const baggagePrice =
            getBaggageById(pax.baggage, flightsBasedOnAddOns?.[flightAddOnsIndex]?.addOns)
              ?.priceWithCurrency?.amount ?? 0;
          totalBaggagePrice += Number(baggagePrice);
        }
        if (pax.meal) {
          const mealPrice =
            getMealById(pax.meal, flightsBasedOnAddOns?.[flightAddOnsIndex]?.addOns)
              ?.priceWithCurrency?.amount ?? 0;
          totalMealPrice += Number(mealPrice);
        }
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightValues]);

  useEffect(() => {
    onPriceListChange?.(priceList, index);
  }, [priceList, index, onPriceListChange]);

  return (
    <Space direction="vertical" className="w-full">
      {flightsBasedOnAddOns?.map((flightAddOns, flightAddOnsIndex) => {
        return (
          <Card size="small" key={`flight-${index}-journey-${flightAddOnsIndex}`}>
            <FlightInfo
              flight={flightAddOns}
              withAddOnsBaggage={false}
              withSelect={false}
              withPrice={false}
            />
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
                        {flightAddOns?.addOns?.baggageOptions &&
                          flightAddOns?.addOns?.baggageOptions.length > 0 && (
                            <Form.Item
                              name={[
                                'flights',
                                `flight-${index}`,
                                `flightAddOns-${flightAddOnsIndex}`,
                                'paxs',
                                `pax-${paxIndex}`,
                                'baggage',
                              ]}
                              label="Baggage"
                              rules={[{ required: true }]}
                              className="mb-0"
                              initialValue={flightAddOns?.addOns?.baggageOptions?.[0]?.id}
                            >
                              <Select
                                placeholder="Baggage"
                                options={flightAddOns?.addOns?.baggageOptions?.map((baggage) => ({
                                  label: `${baggage.baggageWeight} ${baggage.baggageType} (${baggage.priceWithCurrency.currency} ${formatIDR(baggage.priceWithCurrency.amount)})`,
                                  value: baggage.id,
                                  baggage,
                                }))}
                                style={{ width: '180px' }}
                              />
                            </Form.Item>
                          )}
                        {flightAddOns?.addOns?.mealOptions &&
                          flightAddOns?.addOns?.mealOptions.length > 0 && (
                            <Form.Item
                              name={[
                                'flights',
                                `flight-${index}`,
                                `flightAddOns-${flightAddOnsIndex}`,
                                'paxs',
                                `pax-${paxIndex}`,
                                'meal',
                              ]}
                              label="Meal"
                              rules={[{ required: true }]}
                              className="mb-0"
                              initialValue={flightAddOns?.addOns?.mealOptions?.[0]?.id}
                            >
                              <Select
                                placeholder="Meal"
                                options={flightAddOns?.addOns?.mealOptions?.map((meal) => ({
                                  label: meal.displayName,
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
      })}
    </Space>
  );
};

export default FlightConfirm;
