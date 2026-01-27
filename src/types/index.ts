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
