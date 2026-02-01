export type ResponseType<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type UserType = {
  id: number;
  companyId: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  positionId: number;
  phoneNo: string;
  status: number;
  createdBy: number;
  createdAt: string;
  updatedBy: number;
  updatedAt: string;
};

export type AirlineType = {
  airlineCode: string;
  airlineName: string;
  logoUrl: string;
};

export type AirportType = {
  airportCode: string;
  city: string;
  countryId: string;
  countryCode: string;
  areaCode: string;
  timeZone: string;
  internationalAirportName: string;
  airportIcaoCode: string;
  localAirportName: string;
  localCityName: string;
  countryName: string;
};

export type PaginationResponseType<T> = {
  data: T[];
  message: string;
  success: boolean;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
};

export type PassengerType = {
  id: string;
  companyId: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  positionId: number;
  phoneNo: string;
  status: number;
  createdBy: number;
  createdAt: string;
  updatedBy: number;
  updatedAt: string;
};

export type TripType = 'roundTrip' | 'oneWay' | 'multiCity';

export type FlightSearchParamsType = {
  tripType: TripType;
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  segments?: {
    origin: string;
    destination: string;
    departureDate: string;
  }[];
  bookerName: string;
  flightClass: string;
  attachments: string[];
  paxList: {
    email: string;
  }[];
  selectedFlight?: FlightSearchOneWayType;
};

export type FlightSearchOneWayPayloadType = {
  journey: {
    depAirportOrAreaCode: string;
    arrAirportOrAreaCode: string;
    depDate: string;
    seatClass: string;
    sortBy: string;
  };
  passengers: {
    adult: string;
    child: string;
    infant: string;
  };
};

export type FlightSearchOneWayType = {
  flightId: string;
  departureAirport: string;
  arrivalAirport: string;
  numOfTransits: string;
  journeys: {
    numOfTransits: string;
    journeyDuration: string;
    daysOffset: string;
    refundableStatus: string;
    departureDetail: {
      airportCode: string;
      departureDate: string;
      departureTime: string;
      departureTerminal: string;
    };
    arrivalDetail: {
      airportCode: string;
      arrivalDate: string;
      arrivalTime: string;
      arrivalTerminal: string;
    };
    fareInfo: any;
    segments: any[];
  }[];
  tripDuration: string;
};

export type FlightSearchOneWayResponseType = {
  completed: boolean;
  oneWayFlightSearchResults: FlightSearchOneWayType[];
};
