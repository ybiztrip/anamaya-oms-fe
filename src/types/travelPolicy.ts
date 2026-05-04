export type TravelPolicyType = {
  id: number;
  companyId?: number;
  name: string;
  flights: {
    name: string;
    isActive: boolean;
  }[];
  flightMinimumPrice: number;
  flightMaximumPrice: number;
  flightMinimumClass: string;
  flightMaximumClass: string;
  hotelMinimumPrice: number;
  hotelMaximumPrice: number;
  hotelMinimumClass: string;
  hotelMaximumClass: string;
  hotelPagu?: string;
  status: number;
  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
};

export type TravelPolicyListPayloadType = {
  page: number;
  size: number;
};
