export type TrainStationType = {
  cityName: string;
  id: string;
  name: string;
  stationCode: string;
  stationName: string;
};

export type TrainSearchPayloadType = {
  // TODO: train payload type
  journey: {
    depStationCode: string;
    arrStationCode: string;
    depDate: string;
    seatClass: string;
    sortBy?: string;
  };
  passengers: {
    adult: string;
    child: string;
    infant: string;
  };
};

export type TrainSearchType = {
  // TODO: train search type
  trainId: string;
  trainNumber: string;
  trainName: string;
  originStationCode: string;
  destinationStationCode: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  durationInMinutes: number;
  trainClass: string;
  subclass?: string;
  availableSeats: number;
  fare: {
    amount: number;
    currency: string;
  };
  summary: {
    name: string;
    trainClass: string;
  };
};

export type TrainSearchResponseType = TrainSearchType[];
