export type TrainStationType = {
  cityName: string;
  stationCode: string;
  stationName: string;
};

export type TrainChargeType = {
  amount: number;
  chargeCode: string;
  chargeTypeString: string | null;
  currencyCode: string;
  foreignAmount: number;
  foreignCurrencyCode: string | null;
  chargeDetail: unknown | null;
};

export type TrainPaxFareType = {
  charges: TrainChargeType[];
  paxType: string;
};

export type TrainSegmentType = {
  active: boolean;
  class: string;
  classKey: string;
  className: string;
  fare: number;
  paxFares: TrainPaxFareType[];
  seat: number;
  subClass: string;
};

export type TrainJourneyType = {
  arrivalDate: string;
  arrivalTime: string;
  carrierNumber: string;
  departureDate: string;
  departureTime: string;
  destination: string;
  duration: string;
  journeyCode: string;
  origin: string;
  provider: number;
  segments: TrainSegmentType[];
  sequence: number;
  trainName: string;
  trainNumber: string | null;
};

export type TrainScheduleType = {
  available: boolean;
  destination: string;
  destinationDisplay: string;
  errorMessage: string | null;
  journeys: TrainJourneyType[];
  origin: string;
  originDisplay: string;
};

export type TrainAvailabilityPayloadType = {
  route: {
    origin: string;
    destination: string;
    departDate: string;
  };
  adult: number;
  infant: number;
  class: number;
};

export type TrainAvailabilityResponseType = {
  schedules: TrainScheduleType[];
};

export type TrainSeatStatus = -1 | 0 | 1;

export type TrainSeatCellType = {
  seatId: string;
  seatNumber: string;
  seatStatus: TrainSeatStatus;
  x: number;
  y: number;
};

export type TrainCoachType = {
  coachName: string;
  code: string;
  num: number;
  seatRows: TrainSeatCellType[][];
};

export type TrainSeatGetPayloadType = {
  trainId: number;
};

export type TrainSeatSetPayloadType = {
  trainId: number;
  seats: {
    paxId: number;
    coachName: string;
    seatNumber: string;
  }[];
};

export type TrainSeatResponseType = TrainCoachType[];
