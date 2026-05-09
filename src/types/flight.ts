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

export type FareType = {
  baseFareWithCurrency: {
    amount: string;
    currency: string;
  };
  vatWithCurrency: {
    amount: string;
    currency: string;
  };
  pscWithCurrency: {
    amount: string;
    currency: string;
  };
  fuelSurchargeWithCurrency: {
    amount: string;
    currency: string;
  };
  adminFeeWithCurrency: {
    amount: string;
    currency: string;
  };
  additionalFeeWithCurrency: {
    amount: string;
    currency: string;
  };
  totalFareWithCurrency: {
    amount: string;
    currency: string;
  };
};

export type AddOnBaggageType = {
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
    fareInfo: {
      partnerFare: {
        adultFare: FareType;
        childFare: any;
        infantFare: any;
      };
      airlineFare: {
        adultFare: FareType;
        childFare: any;
        infantFare: any;
      };
      netToAgent: {
        adultFare: {
          amount: string;
          currency: string;
        };
        childFare: any;
        infantFare: any;
      };
    };
    segments: {
      flightCode: string;
      marketingAirline: string;
      brandAirline: string;
      operatingAirline: string;
      subClass: string;
      seatClass: string;
      flightDurationInMinutes: string;
      transitDurationInMinutes: string | null;
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
      stopInfo: any;
      addOns: {
        baggageOptions: AddOnBaggageType[];
        mealOptions: any[];
        fareBasisCode: string;
      };
      fareBasisCode: any;
      visaRequired: boolean;
      mayNeedReCheckIn: boolean;
      sourceAirport: string;
      destinationAirport: string;
      departureDate: string;
      arrivalDate: string;
    }[];
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
    baggageOptions: AddOnBaggageType[];
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
