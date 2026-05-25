import type { UploadFile } from 'antd';

import type { FlightBookingAddOnType, FlightSearchOneWayType, TripType } from './flight';
import type { HotelPropertyType, HotelRoomRateType } from './hotel';

export type PassengerGuestType = {
  id: string;
  companyId: number;
  travelPolicyId?: number;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
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
  selectedHotel?: HotelPropertyType;
  selectedRoom?: HotelRoomRateType;
};

export type BookingParamsType = {
  tripType?: TripType;
  flights?: BookingFlightParamsType[];
  hotel?: BookingHotelParamsType | null;
  bookerName: string;
  attachments: UploadFile[];
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
  totalAmount?: number;
  paymentMethod: string;
  paymentReference1?: string;
  paymentReference2?: string;
  metadata: any;
  createdAt?: string;
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
  bookingId?: number;
  companyId?: number;
  status?: string;
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
  metadata: any;
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
  hotels: (BookingHotelType & { paxs: BookingHotelPaxType[] })[];
  attachments?: {
    id: number;
    companyId: number;
    bookingId: number;
    bookingCode: string;
    file: string;
    type: string;
  }[];
};

export type BookingPriceItemType = {
  item: string;
  currency: string;
  amount: number;
};

export type BookingListPayloadType = {
  userId?: string;
  size?: number;
  page?: number;
  needAttachment?: boolean;
};

export type BookingMyApprovalPayloadType = {
  size?: number;
  page?: number;
  needAttachment?: boolean;
};

export type BookingNeedApprovalPayloadType = {
  size?: number;
  page?: number;
  needAttachment?: boolean;
};

export type BookingDetailResponseType = BookingType;

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

export type BookingAttachmentPayloadType = {
  files: string[];
};

export type BookingAttachmentResponseType = any;

export type BookingApprovePayloadType = {
  flightIds: number[];
  hotelIds: number[];
};

export type BookingRejectPayloadType = {
  flightIds: number[];
  hotelIds: number[];
};

export type BookingETicketPayloadType = {
  type: string;
  partnerBookingId: string;
};
