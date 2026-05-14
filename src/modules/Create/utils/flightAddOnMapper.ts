import type { FlightBookingAddOnType, FlightSearchOneWayType } from '@/types';

export function buildAvailableAddOnsFlights(
  flight: FlightSearchOneWayType,
  flightAddOns: FlightBookingAddOnType[] | undefined,
): FlightBookingAddOnType[] {
  const journeys = flight.journeys ?? [];
  const options = flightAddOns ?? [];

  return journeys.flatMap((_journey, journeyIndex): FlightBookingAddOnType[] => {
    const addOns = options[journeyIndex];

    if (addOns?.availableAddOnsOptions !== null) {
      return addOns
        ? [addOns]
        : [{ segmentsWithAvailableAddOns: [], availableAddOnsOptions: null }];
    }

    if (addOns?.segmentsWithAvailableAddOns?.length) {
      return addOns.segmentsWithAvailableAddOns.map((seg) => ({
        segmentsWithAvailableAddOns: [seg],
        availableAddOnsOptions: seg.availableAddOnsOptions,
      }));
    }

    return [
      {
        segmentsWithAvailableAddOns: [],
        availableAddOnsOptions: null,
      },
    ];
  });
}

export function buildPaxWithSelectedAddOnPayload(
  template: FlightBookingAddOnType,
  values: any,
  flightIndex: number,
  slotIndex: number,
  paxIndex: number,
): FlightBookingAddOnType {
  const paxAddOnValues =
    values?.flights?.[`flight-${flightIndex}`]?.[`flightAddOns-${slotIndex}`]?.paxs?.[
      `pax-${paxIndex}`
    ] ?? {};

  const baggageId = paxAddOnValues?.baggage;
  const mealId = paxAddOnValues?.meal;

  const base = template.availableAddOnsOptions;

  return {
    ...template,
    availableAddOnsOptions: {
      baggageOptions: baggageId
        ? (base?.baggageOptions ?? []).filter((b) => b.id === baggageId)
        : [],
      mealOptions: mealId ? (base?.mealOptions ?? []).filter((m) => m.id === mealId) : [],
    },
  };
}
