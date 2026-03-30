export * from './booking';
export * from './flight';
export * from './hotel';

export type ResponseType<T> = {
  data: T;
  message: string;
  success: boolean;
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
