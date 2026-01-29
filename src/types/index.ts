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
}

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
