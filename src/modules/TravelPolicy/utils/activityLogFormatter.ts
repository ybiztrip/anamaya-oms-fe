import { FLIGHT_CLASS_LABELS } from '@/constants/common';
import type { AirlineType } from '@/types';
import { rupiahFormatter } from '@/utils/formatter';

const TRAVEL_POLICY_CHANGE_LABELS: Record<string, string> = {
  flights: 'Flights',
  name: 'Policy Name',
  status: 'Status',
  includingGarudaAirline: 'Including Garuda Airline',
  flightMinimumPrice: 'Flight Minimum Price',
  flightMaximumPrice: 'Flight Maximum Price',
  flightMinimumClass: 'Flight Minimum Class',
  flightMaximumClass: 'Flight Maximum Class',
  hotelMinimumPrice: 'Hotel Minimum Price',
  hotelMaximumPrice: 'Hotel Maximum Price',
  hotelMinimumClass: 'Hotel Minimum Class',
  hotelMaximumClass: 'Hotel Maximum Class',
};

const toArrowText = (value: string) => value.split(/\s*->\s*/).join(' to ');

type TravelPolicyChangeSummaryOptions = {
  airlinesByCode?: Record<string, AirlineType>;
};

const PRICE_FIELDS = new Set([
  'flightMinimumPrice',
  'flightMaximumPrice',
  'hotelMinimumPrice',
  'hotelMaximumPrice',
]);

const CLASS_FIELDS = new Set(['flightMinimumClass', 'flightMaximumClass']);

const STATUS_FIELDS = new Set(['status']);

const AIRLINE_FIELDS = new Set(['flights']);

const formatValue = (field: string, value: string) => {
  if (PRICE_FIELDS.has(field)) {
    return rupiahFormatter(value);
  }
  if (CLASS_FIELDS.has(field)) {
    return FLIGHT_CLASS_LABELS[value] ?? value;
  }
  if (STATUS_FIELDS.has(field)) {
    return value === '1' ? 'Active' : 'Inactive';
  }
  if (AIRLINE_FIELDS.has(field)) {
    return value ? 'Active' : 'Inactive';
  }
  return value;
};

const formatFieldChangeSummary = (field: string, rest: string, airlinesByCode?: Record<string, AirlineType>) => {
  if (!rest.includes('->')) {
    return `${TRAVEL_POLICY_CHANGE_LABELS[field] ?? field}${rest}`;
  }

  const parts = rest.split('->');
  if (parts.length < 2) {
    return `${TRAVEL_POLICY_CHANGE_LABELS[field] ?? field}${rest}`;
  }

  let before = parts[0]?.trim() ?? '';
  let after = parts.slice(1).join('->').trim();
  let label = TRAVEL_POLICY_CHANGE_LABELS[field] ?? field;

  if (!before && !after) {
    return `${TRAVEL_POLICY_CHANGE_LABELS[field] ?? field}${rest}`;
  }

  if (AIRLINE_FIELDS.has(field)) {
    const beforeJson = JSON.parse(before);
    const afterJson = JSON.parse(after);
    before = beforeJson?.[0]?.isActive;
    after = afterJson?.[0]?.isActive;
    const airlineCode = afterJson?.[0]?.name ?? beforeJson?.[0]?.name;
    label = `Including ${airlinesByCode?.[airlineCode]?.airlineName ?? airlineCode}`;
  }

  return `${label} ${formatValue(field, before)} to ${formatValue(field, after)}`;
};

export const formatTravelPolicyChangeSummary = (
  entry: string,
  options?: TravelPolicyChangeSummaryOptions,
) => {
  const match = /^(\w+)(.*)$/.exec(entry);
  if (!match) {
    return toArrowText(entry);
  }

  const [, field, rest] = match;
  const label = TRAVEL_POLICY_CHANGE_LABELS[field];

  if (!label) {
    return toArrowText(entry);
  }

  return toArrowText(formatFieldChangeSummary(field, rest, options?.airlinesByCode));
};
