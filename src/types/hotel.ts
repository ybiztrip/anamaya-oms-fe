export type HotelGeoListPayloadType = {
  countryCode: string;
  offset: string;
  key: string;
  limit: string;
};

export type HotelGeoListType = {
  geoId: string;
  parentId: string;
  type: string;
  name: string;
  localeName: string;
  centroId: {
    lon: string;
    lat: string;
    valid: boolean;
  };
};

export type HotelDiscoveryPayloadType = {
  geoId: string;
  checkInDate: string;
  checkOutDate: string;
  cursor: string;
  numRooms: number;
  displayCurrency: string;
  sortBy: string;
  filters: {
    priceRange: {
      max: number;
      min: number;
    };
    starRating: boolean[];
  };
  page: number;
  limit: number;
};

export type HotelPropertyType = {
  propertyId: string;
  propertySummary: {
    name: string;
    formerName: string;
    address: {
      lines: string[];
      city: string;
      province: string;
      postalCode: string;
      country: string;
    };
    phoneNumber: string;
    localAddress: {
      lines: string[];
      city: string;
      province: string;
      postalCode: string;
      country: string;
    };
    starRating: string;
    reviewScore: any;
    accommodationType: string;
    geoLocation: {
      lat: string;
      lon: string;
    };
    countryISO: string;
    geoId: string;
  };
  propertyImages: {
    entries: {
      imageType: 'SMALL' | 'MEDIUM' | 'LARGE';
      url: string;
    }[];
    main: boolean;
    isMain: boolean;
  }[];
  cheapestRoomName: string;
  cheapestRoom: {
    chargeableRate: {
      currencyCode: string;
      averageBaseRate: string;
      averageRate: string;
      nightlyRateTotal: string;
      surchargeTotal: string;
      total: string;
      surcharges: {
        type: string;
        displayCurrency: string;
        displayAmount: number;
        included: boolean;
      }[];
      nightlyRates: {
        date: string;
        baseRate: string;
        promo: boolean;
        nightRate: string;
      }[];
      recommendedSellingPrice: null;
      serviceFeeCharges: string;
      serviceFeeTotal: string;
      chargeableRateInfo: string;
    };
    convertedChargeableRate: any;
    numOfRooms: string;
    roomId: string;
  };
  rateKey: string;
};

export type HotelDiscoveryResponseType = {
  totalProperties: string;
  maximalOffset: string;
  properties: HotelPropertyType[];
  nextCursor: string;
  totalPages: number;
};
