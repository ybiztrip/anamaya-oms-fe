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

export type HotelRoomPayloadType = {
  propertyId: string;
};

export type HotelRoomType = {
  roomId: string;
  propertyId: string;
  roomStatus: string;
  roomName: string;
  roomType: string;
  bedArrangementData: {
    bedroomLayouts: {
      arrangements: {
        bedType: string;
        total: number;
      }[];
      arrangementType: string;
      id: string;
    }[];
  }[];
  imageData: {
    entries: {
      imageType: 'SMALL' | 'MEDIUM' | 'LARGE';
      url: string;
    }[];
  }[];
  facilityData: {
    facilityId: string;
    category: string;
    name: string;
  }[];
  roomView: string;
  roomWindow: boolean;
  size: string;
  unit: string;
};

export type HotelRoomResponseType = HotelRoomType[];

export type HotelRoomRatePayloadType = {
  checkInDate: string;
  checkOutDate: string;
  language: string;
  userNationality: string;
  numRooms: number;
  numAdults: number;
  displayCurrency: string;
  isExtended: boolean;
  propertyId: string;
};

export type HotelRoomRateType = {
  rateStatus: string;
  propertyId: string;
  providerRoomId: string | null;
  roomId: string;
  roomName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numRooms: number;
  numAdults: number;
  numChildren: number;
  maxOccupancy: number;
  mealType: string;
  rateKey: string;
  totalRates: {
    displayCurrency: string;
    displaySellAmount: number;
    displayNettAmount: number;
    partnerCurrency: string;
    partnerSellAmount: number;
    partnerNettAmount: number;
  };
  nightlyRates: {
    displayCurrency: string;
    displaySellAmount: number;
    displayNettAmount: number;
    partnerCurrency: string;
    partnerSellAmount: number;
    partnerNettAmount: number;
  };
  charges: {
    type: string;
    displayCurrency: string;
    displayAmount: number;
    included: boolean;
  }[];
  ratesPerDay: {
    date: string;
    baseRate: string;
    promo: boolean;
    nightRate: string;
  }[];
  cancellationPolicy: {
    text: string;
    displayText: string;
    propertyTimezone: string | null;
    policies: string | null;
  };
  checkInPolicy: {
    checkInDate: string;
    checkOutDate: string;
  };
  occupancyPricing: null;
  bedArrangement: {
    bedroomLayouts: {
      arrangements: {
        bedType: string;
        total: number;
      }[];
      arrangementType: string;
      id: string;
    }[];
  }[];
  roomImages: {
    entries: {
      imageType: 'SMALL' | 'MEDIUM' | 'LARGE';
      url: string;
    }[];
  }[];
  roomFacilities: {
    facilityId: string;
    category: string;
    name: string;
  }[];
  roomSize: {
    size: string;
    unit: string;
  };
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
      city: 'Jakarta';
      province: string;
      postalCode: string;
      country: string;
    };
    starRating: string;
    reviewScore: null;
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
    main: true;
    isMain: true;
  }[];
  propertyFacilities: {
    id: string | null;
    category: string;
    name: string;
  }[];
  refundable: boolean;
  isRefundable: boolean;
  wifiIncluded: boolean;
  breakfastIncluded: boolean;
  smokingAllowed: boolean;
};

export type HotelRoomRateResponseType = HotelRoomRateType[];
