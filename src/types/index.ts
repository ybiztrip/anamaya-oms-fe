export * from './hotel';

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
  countryCode: string;
  phoneNo: string;
  title: string;
  identityNo: string;
  passportNo: string;
  passportExpiry: string;
  dateOfBirth: string;
  nationality: string;
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

export type PassengerGuestType = {
  id: string;
  companyId: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  phoneCode: string;
  dob: string;
  idNumber: string;
  passportNumber: string;
  passportExpiry: string;
  type?: string;
};

export type TripType = 'roundTrip' | 'oneWay' | 'multiCity';

export type BookingFlightParamsType = {
  name: string;
  origin: string;
  destination: string;
  departureDate: string;
  flightClass: string;
  selectedFlight?: FlightSearchOneWayType;
};

export type BookingHotelParamsType = {
  destinationGeo: string;
  destinationName: string;
  checkInDate: string;
  checkOutDate: string;
  hotelStars: string[];
  rooms: number;
  notes?: string;
  selectedHotel?: any; // TODO: selected hotel type
};

export type BookingParamsType = {
  tripType?: TripType;
  flights?: BookingFlightParamsType[];
  hotel?: BookingHotelParamsType | null;
  bookerName: string;
  attachments: string[];
  paxList: PassengerGuestType[];
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

export type BookingPayloadType = {
  startDate: string;
  endDate: string;
  contactEmail: string;
  contactFirstName: string;
  contactLastName: string;
  contactTitle: string;
  contactNationality: string;
  contactPhoneCode: string;
  contactPhoneNumber: string;
  contactDob: string;
};

export type BookingResponseType = {
  id: number;
  companyId: number;
  code: string;
  journeyCode: string | null;
  startDate: string;
  endDate: string;
  contactEmail: string;
  contactFirstName: string;
  contactLastName: string;
  contactTitle: string;
  contactNationality: string;
  contactPhoneCode: string;
  contactPhoneNumber: string;
  contactDob: string;
  additionalInfo: any;
  clientAdditionalInfo: any;
  status: string;
  flights: any;
  hotels: any;
};

export type BookingFlightPayloadType = {
  flights: {
    type: number;
    clientSource: string;
    itemId: string;
    origin: string;
    destination: string;
    departureDatetime: string;
    arrivalDatetime: string;
  }[];
  paxs: {
    firstName: string;
    lastName: string;
    title: string;
    gender: string;
    type: string;
    email: string;
    nationality: string;
    phoneCode: string;
    phoneNumber: string;
    dob: string;
    addOn: FlightBookingAddOnType[];
    issuingCountry: string;
    documentType: string;
    documentNo: string;
    expirationDate: string;
  }[];
};

export type BookingFlightResponseType = any;
