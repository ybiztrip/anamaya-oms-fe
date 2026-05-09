import { FLIGHT_CLASS_RANK } from '@/constants/common';
import type { PassengerGuestType, TravelPolicyType } from '@/types';

type TravelPolicyLimits = {
  flightMinPrice: number;
  flightMaxPrice: number;
  flightMinClass: string;
  flightMaxClass: string;
  flightIncludedAirlines: string[];
  hotelMinPrice: number;
  hotelMaxPrice: number;
  hotelMinClass: number;
  hotelMaxClass: number;
};

const emptyLimits: TravelPolicyLimits = {
  flightMinPrice: 0,
  flightMaxPrice: Infinity,
  flightMinClass: '',
  flightMaxClass: '',
  flightIncludedAirlines: [],
  hotelMinPrice: 0,
  hotelMaxPrice: Infinity,
  hotelMinClass: 0,
  hotelMaxClass: 5,
};

export default function getTravelPolicyLimits(
  paxList: PassengerGuestType[] | undefined,
  travelPoliciesById: Record<number, TravelPolicyType> | undefined,
): TravelPolicyLimits | null {
  const policies =
    paxList
      ?.map((pax) => (pax.travelPolicyId ? travelPoliciesById?.[pax.travelPolicyId] : null))
      .filter((policy): policy is TravelPolicyType => Boolean(policy)) ?? [];

  if (!policies.length) return null;

  const flightMinPrice = Math.max(...policies.map((policy) => policy.flightMinimumPrice ?? 0));
  const flightMaxPrice = Math.min(
    ...policies.map((policy) => policy.flightMaximumPrice ?? Infinity),
  );

  const flightMinClass = policies.reduce((acc, policy) => {
    if (!acc) return policy.flightMinimumClass;
    return FLIGHT_CLASS_RANK[policy.flightMinimumClass] > FLIGHT_CLASS_RANK[acc]
      ? policy.flightMinimumClass
      : acc;
  }, '');

  const flightMaxClass = policies.reduce((acc, policy) => {
    if (!acc) return policy.flightMaximumClass;
    return FLIGHT_CLASS_RANK[policy.flightMaximumClass] < FLIGHT_CLASS_RANK[acc]
      ? policy.flightMaximumClass
      : acc;
  }, '');

  const flightIncludedAirlines = policies.reduce(
    (acc, policy) => {
      const activeAirlines = (policy.flights ?? []).filter((f) => f.isActive).map((f) => f.name);
      if (!acc) return activeAirlines;
      return acc.filter((code) => activeAirlines.includes(code));
    },
    undefined as string[] | undefined,
  ) ?? [];

  const hotelMinPrice = Math.max(...policies.map((policy) => policy.hotelMinimumPrice ?? 0));
  const hotelMaxPrice = Math.min(...policies.map((policy) => policy.hotelMaximumPrice ?? Infinity));

  const hotelMinClass = Math.max(
    ...policies.map((policy) => Number(policy.hotelMinimumClass ?? 0)).filter(Number.isFinite),
  );
  const hotelMaxClass = Math.min(
    ...policies.map((policy) => Number(policy.hotelMaximumClass ?? 5)).filter(Number.isFinite),
  );

  return {
    ...emptyLimits,
    flightMinPrice,
    flightMaxPrice,
    flightMinClass,
    flightMaxClass,
    flightIncludedAirlines,
    hotelMinPrice,
    hotelMaxPrice,
    hotelMinClass,
    hotelMaxClass,
  };
}
