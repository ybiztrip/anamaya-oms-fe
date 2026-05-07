export * from './activityLog';
export * from './booking';
export * from './company';
export * from './flight';
export * from './hotel';
export * from './travelPolicy';
export * from './user';

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
