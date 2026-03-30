import type { FlightBookingAddOnType, FlightSearchOneWayType, TripType } from './flight';
import type { HotelPropertyType, HotelRoomRateType } from './hotel';

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
  selectedHotel?: HotelPropertyType;
  selectedRoom?: HotelRoomRateType;
};

export type BookingParamsType = {
  tripType?: TripType;
  flights?: BookingFlightParamsType[];
  hotel?: BookingHotelParamsType | null;
  bookerName: string;
  attachments: string[];
  paxList: PassengerGuestType[];
};

export type BookingFlightType = {
  id?: string;
  bookingId?: string;
  companyId?: number;
  status?: string;
  type: number;
  clientSource: string;
  itemId: string;
  origin: string;
  destination: string;
  departureDatetime: string;
  arrivalDatetime: string;
  paymentMethod: string;
  paymentReference1: string;
  paymentReference2: string;
};

export type BookingPaxType = {
  id?: string;
  bookingId?: string;
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
  issuingCountry: string;
  documentType: string;
  documentNo: string;
  expirationDate: string;
};

export type BookingFlightPaxType = BookingPaxType & {
  addOn: FlightBookingAddOnType[];
};

export type BookingHotelPaxType = BookingPaxType;

export type BookingHotelType = {
  id?: string;
  clientSource: string;
  itemId: string;
  roomId: string;
  rateKey: string;
  numRoom: number;
  checkInDate: string;
  checkOutDate: string;
  partnerSellAmount: number;
  partnerNettAmount: number;
  currency: string;
  paymentMethod: string;
  paymentReference1: string;
  paymentReference2: string;
  specialRequest: string;
};

export type BookingType = {
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
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  flights: (BookingFlightType & { paxs: BookingFlightPaxType[] })[];
  hotels: BookingHotelType;
};

export type BookingPriceItemType = {
  item: string;
  currency: string;
  amount: number;
};

export type BookingListPayloadType = {
  userId?: string;
  status?: string;
};

export type BookingListResponseType = BookingType[];

export type BookingCreatePayloadType = {
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

export type BookingCreateResponseType = BookingType;

export type BookingFlightPayloadType = {
  flights: BookingFlightType[];
  paxs: BookingFlightPaxType[];
};

export type BookingFlightResponseType = any;

export type BookingHotelPayloadType = {
  hotel: BookingHotelType;
  paxs: BookingHotelPaxType[];
};

export type BookingHotelResponseType = any;
