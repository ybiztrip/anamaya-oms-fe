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

export type TripType = 'roundTrip' | 'oneWay' | 'multiCity';

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

export type FlightBookingAddOnsPayloadType = {
  journeyType: string;
  flightIds: string[];
};

export type FlightBookingAddOnType = {
  segmentsWithAvailableAddOns: [];
  availableAddOnsOptions: {
    baggageOptions: {
      id: string;
      baggageType: string;
      baggageQuantity: string;
      baggageWeight: string;
      priceWithCurrency: {
        amount: string;
        currency: string;
      };
      netToAgent: {
        amount: string;
        currency: string;
      };
    }[];
    // TODO: meal options type
    mealOptions: {
      id: string;
      mealType: string;
      mealName: string;
      priceWithCurrency: {
        amount: string;
        currency: string;
      };
    }[];
  };
};

export type FlightBookingAddOnsResponseType = {
  journeysWithAvailableAddOnsOptions: FlightBookingAddOnType[];
};
