import type {
  AirlineType,
  AirportType,
  FlightBookingAddOnsResponseType,
  FlightSearchOneWayResponseType,
  ResponseType,
  TrainSearchResponseType,
  TrainStationType,
} from '@/types';

export const mockFetchAirports: ResponseType<AirportType[]> = {
  success: true,
  message: 'Success',
  data: [
    {
      airportCode: 'CGK',
      localAirportName: 'Soekarno Hatta International Airport',
      localCityName: 'Jakarta',
      countryName: 'Indonesia',
    },
    {
      airportCode: 'DPS',
      localAirportName: 'Ngurah Rai International Airport',
      localCityName: 'Bali / Denpasar',
      countryName: 'Indonesia',
    },
  ],
};

export const mockFetchAirlines: ResponseType<AirlineType[]> = {
  success: true,
  message: 'Success',
  data: [
    {
      airlineCode: 'GA',
      airlineName: 'Garuda Indonesia',
      logoUrl:
        'https://ik.imagekit.io/tvlk/image/imageResource/2019/12/12/1576140134467-906ded3638e9045d664adc40caa8ec47.png?tr=q-75',
    },
  ],
};

export const mockFetchFlightSearchOneWay: ResponseType<FlightSearchOneWayResponseType> = {
  success: true,
  message: 'Success',
  data: {
    completed: false,
    oneWayFlightSearchResults: [
      {
        flightId: '1st:b8ff96ed05807929abd5cc78b510e903ed2eb71b6ff159b815a6756c313fe468',
        departureAirport: 'CGK',
        arrivalAirport: 'NRT',
        numOfTransits: '1',
        journeys: [
          // {
          //   numOfTransits: '0',
          //   journeyDuration: '310',
          //   daysOffset: '0',
          //   refundableStatus: 'NON_REFUNDABLE',
          //   departureDetail: {
          //     airportCode: 'CGK',
          //     departureDate: '05-14-2026',
          //     departureTime: '14:20',
          //     departureTerminal: '2D',
          //   },
          //   arrivalDetail: {
          //     airportCode: 'HKG',
          //     arrivalDate: '05-14-2026',
          //     arrivalTime: '20:30',
          //     arrivalTerminal: '1',
          //   },
          //   fareInfo: {
          //     partnerFare: {
          //       adultFare: {
          //         baseFareWithCurrency: {
          //           amount: '5720190.0',
          //           currency: 'IDR',
          //         },
          //         vatWithCurrency: null,
          //         pscWithCurrency: null,
          //         fuelSurchargeWithCurrency: null,
          //         adminFeeWithCurrency: {
          //           amount: '0.00',
          //           currency: 'IDR',
          //         },
          //         additionalFeeWithCurrency: null,
          //         totalFareWithCurrency: {
          //           amount: '5720190.0',
          //           currency: 'IDR',
          //         },
          //       },
          //       childFare: null,
          //       infantFare: null,
          //     },
          //     airlineFare: {
          //       adultFare: {
          //         baseFareWithCurrency: {
          //           amount: '5720190.0',
          //           currency: 'IDR',
          //         },
          //         vatWithCurrency: null,
          //         pscWithCurrency: null,
          //         fuelSurchargeWithCurrency: null,
          //         adminFeeWithCurrency: null,
          //         additionalFeeWithCurrency: null,
          //         totalFareWithCurrency: {
          //           amount: '5720190.0',
          //           currency: 'IDR',
          //         },
          //       },
          //       childFare: null,
          //       infantFare: null,
          //     },
          //     netToAgent: {
          //       adultFare: {
          //         amount: '5720190.0',
          //         currency: 'IDR',
          //       },
          //       childFare: null,
          //       infantFare: null,
          //     },
          //   },
          //   segments: [
          //     {
          //       flightCode: 'CX-776',
          //       marketingAirline: 'CX',
          //       brandAirline: 'CX',
          //       operatingAirline: 'CX',
          //       subClass: 'V',
          //       seatClass: 'ECONOMY',
          //       flightDurationInMinutes: '310',
          //       transitDurationInMinutes: null,
          //       departureDetail: {
          //         airportCode: 'CGK',
          //         departureDate: '05-14-2026',
          //         departureTime: '14:20',
          //         departureTerminal: '2D',
          //       },
          //       arrivalDetail: {
          //         airportCode: 'HKG',
          //         arrivalDate: '05-14-2026',
          //         arrivalTime: '20:30',
          //         arrivalTerminal: '1',
          //       },
          //       stopInfo: null,
          //       addOns: {
          //         baggageOptions: [
          //           {
          //             id: '0',
          //             baggageType: 'PIECE',
          //             baggageQuantity: '1',
          //             baggageWeight: '23',
          //             priceWithCurrency: {
          //               amount: '0.00',
          //               currency: 'IDR',
          //             },
          //             netToAgent: {
          //               amount: '0.00',
          //               currency: 'IDR',
          //             },
          //           },
          //         ],
          //         mealOptions: [
          //           {
          //             id: '0',
          //             quantity: '1',
          //             displayName: 'Provided meal',
          //             priceWithCurrency: {
          //               amount: '0.00',
          //               currency: 'IDR',
          //             },
          //             netToAgent: {
          //               amount: '0.00',
          //               currency: 'IDR',
          //             },
          //           },
          //         ],
          //         fareBasisCode: '',
          //       },
          //       fareBasisCode: 'VA21IJAH',
          //       visaRequired: false,
          //       mayNeedReCheckIn: false,
          //       sourceAirport: '',
          //       destinationAirport: '',
          //       departureDate: '',
          //       arrivalDate: '',
          //     },
          //   ],
          // },
          // {
          //   numOfTransits: '0',
          //   journeyDuration: '260',
          //   daysOffset: '0',
          //   refundableStatus: 'UNKNOWN',
          //   departureDetail: {
          //     airportCode: 'HKG',
          //     departureDate: '05-15-2026',
          //     departureTime: '00:55',
          //     departureTerminal: 'Midfield Concourse',
          //   },
          //   arrivalDetail: {
          //     airportCode: 'NRT',
          //     arrivalDate: '05-15-2026',
          //     arrivalTime: '06:15',
          //     arrivalTerminal: null,
          //   },
          //   fareInfo: {
          //     partnerFare: {
          //       adultFare: {
          //         baseFareWithCurrency: {
          //           amount: '1626592.0',
          //           currency: 'IDR',
          //         },
          //         vatWithCurrency: null,
          //         pscWithCurrency: null,
          //         fuelSurchargeWithCurrency: null,
          //         adminFeeWithCurrency: {
          //           amount: '0.00',
          //           currency: 'IDR',
          //         },
          //         additionalFeeWithCurrency: null,
          //         totalFareWithCurrency: {
          //           amount: '1626592.0',
          //           currency: 'IDR',
          //         },
          //       },
          //       childFare: null,
          //       infantFare: null,
          //     },
          //     airlineFare: {
          //       adultFare: {
          //         baseFareWithCurrency: {
          //           amount: '1626592.0',
          //           currency: 'IDR',
          //         },
          //         vatWithCurrency: null,
          //         pscWithCurrency: null,
          //         fuelSurchargeWithCurrency: null,
          //         adminFeeWithCurrency: null,
          //         additionalFeeWithCurrency: null,
          //         totalFareWithCurrency: {
          //           amount: '1626592.0',
          //           currency: 'IDR',
          //         },
          //       },
          //       childFare: null,
          //       infantFare: null,
          //     },
          //     netToAgent: {
          //       adultFare: {
          //         amount: '1607073.0',
          //         currency: 'IDR',
          //       },
          //       childFare: null,
          //       infantFare: null,
          //     },
          //   },
          //   segments: [
          //     {
          //       flightCode: 'GK-28',
          //       marketingAirline: 'JQ',
          //       brandAirline: 'GK',
          //       operatingAirline: 'GK',
          //       subClass: 'E',
          //       seatClass: 'PROMO',
          //       flightDurationInMinutes: '260',
          //       transitDurationInMinutes: null,
          //       departureDetail: {
          //         airportCode: 'HKG',
          //         departureDate: '05-15-2026',
          //         departureTime: '00:55',
          //         departureTerminal: 'Midfield Concourse',
          //       },
          //       arrivalDetail: {
          //         airportCode: 'NRT',
          //         arrivalDate: '05-15-2026',
          //         arrivalTime: '06:15',
          //         arrivalTerminal: null,
          //       },
          //       stopInfo: null,
          //       addOns: {
          //         baggageOptions: [
          //           {
          //             id: '0',
          //             baggageType: 'KG',
          //             baggageQuantity: '0',
          //             baggageWeight: '0',
          //             priceWithCurrency: {
          //               amount: '0.00',
          //               currency: 'IDR',
          //             },
          //             netToAgent: {
          //               amount: '0.00',
          //               currency: 'IDR',
          //             },
          //           },
          //         ],
          //         mealOptions: [],
          //         fareBasisCode: '',
          //       },
          //       fareBasisCode: 'ELECOE3',
          //       visaRequired: true,
          //       mayNeedReCheckIn: true,
          //       sourceAirport: '',
          //       destinationAirport: '',
          //       departureDate: '',
          //       arrivalDate: '',
          //     },
          //   ],
          // },
        ],
        tripDuration: '835',
      },
    ],
  },
};

export const mockFetchFlightBookingAddOns: ResponseType<FlightBookingAddOnsResponseType> = {
  success: true,
  message: 'Success',
  data: {
    journeysWithAvailableAddOnsOptions: [
      {
        segmentsWithAvailableAddOns: [
          {
            segment: {
              flightCode: 'QZ-200',
              marketingAirline: 'QZ',
              brandAirline: '',
              operatingAirline: 'QZ',
              subClass: 'Z',
              seatClass: 'ECONOMY',
              flightDurationInMinutes: '',
              transitDurationInMinutes: '',
              departureDetail: null,
              arrivalDetail: null,
              stopInfo: null,
              addOns: null,
              fareBasisCode: null,
              visaRequired: false,
              mayNeedReCheckIn: false,
              sourceAirport: 'CGK',
              destinationAirport: 'KUL',
              departureDate: '05-21-2026',
              arrivalDate: '',
            },
            availableAddOnsOptions: {
              baggageOptions: [
                {
                  id: '0',
                  baggageType: 'KG',
                  baggageQuantity: '0',
                  baggageWeight: '0',
                  priceWithCurrency: {
                    amount: '0.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '0.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '1',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '20',
                  priceWithCurrency: {
                    amount: '436050.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '430817.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '2',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '25',
                  priceWithCurrency: {
                    amount: '1000350.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '988346.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '3',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '30',
                  priceWithCurrency: {
                    amount: '1308150.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '1292452.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '4',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '40',
                  priceWithCurrency: {
                    amount: '1975050.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '1951349.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '5',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '50',
                  priceWithCurrency: {
                    amount: '2590650.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '2559562.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '6',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '60',
                  priceWithCurrency: {
                    amount: '3514050.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '3471881.00',
                    currency: 'IDR',
                  },
                },
              ],
              mealOptions: [],
            },
          },
          {
            segment: {
              flightCode: 'AK-524',
              marketingAirline: 'AK',
              brandAirline: '',
              operatingAirline: 'AK',
              subClass: 'Z',
              seatClass: 'ECONOMY',
              flightDurationInMinutes: '',
              transitDurationInMinutes: '',
              departureDetail: null,
              arrivalDetail: null,
              stopInfo: null,
              addOns: null,
              fareBasisCode: null,
              visaRequired: false,
              mayNeedReCheckIn: false,
              sourceAirport: 'KUL',
              destinationAirport: 'SGN',
              departureDate: '05-21-2026',
              arrivalDate: '',
            },
            availableAddOnsOptions: {
              baggageOptions: [
                {
                  id: '0',
                  baggageType: 'KG',
                  baggageQuantity: '0',
                  baggageWeight: '0',
                  priceWithCurrency: {
                    amount: '0.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '0.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '2',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '20',
                  priceWithCurrency: {
                    amount: '518001.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '511785.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '3',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '25',
                  priceWithCurrency: {
                    amount: '667551.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '659540.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '4',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '30',
                  priceWithCurrency: {
                    amount: '790368.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '780884.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '5',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '40',
                  priceWithCurrency: {
                    amount: '1145817.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '1132067.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '6',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '50',
                  priceWithCurrency: {
                    amount: '1421316.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '1404260.00',
                    currency: 'IDR',
                  },
                },
                {
                  id: '7',
                  baggageType: 'KG',
                  baggageQuantity: '1',
                  baggageWeight: '60',
                  priceWithCurrency: {
                    amount: '1972551.00',
                    currency: 'IDR',
                  },
                  netToAgent: {
                    amount: '1948880.00',
                    currency: 'IDR',
                  },
                },
              ],
              mealOptions: [],
            },
          },
        ],
        availableAddOnsOptions: null,
      },
      {
        segmentsWithAvailableAddOns: [],
        availableAddOnsOptions: {
          baggageOptions: [
            {
              id: '0',
              baggageType: 'PIECE',
              baggageQuantity: '2',
              baggageWeight: '23',
              priceWithCurrency: {
                amount: '0.00',
                currency: 'IDR',
              },
              netToAgent: {
                amount: '0.00',
                currency: 'IDR',
              },
            },
          ],
          mealOptions: [],
        },
      },
    ],
  },
};

export const mockFetchTrainStations: ResponseType<TrainStationType[]> = {
  success: true,
  message: 'Success',
  data: [
    {
      cityName: 'JAKARTA',
      id: 'AK',
      name: 'AK - ANGKE - (JAKARTA)',
      stationCode: 'AK',
      stationName: 'ANGKE',
    },
    {
      cityName: 'CIREBON',
      id: 'CNP',
      name: 'CNP - CIREBONPRUNJAKAN - (CIREBON)',
      stationCode: 'CNP',
      stationName: 'CIREBONPRUNJAKAN',
    },
    {
      cityName: 'JAKARTA',
      id: 'DU',
      name: 'DU - DURI - (JAKARTA)',
      stationCode: 'DU',
      stationName: 'DURI',
    },
    {
      cityName: 'JAKARTA',
      id: 'GMR',
      name: 'GMR - GAMBIR - (JAKARTA)',
      stationCode: 'GMR',
      stationName: 'GAMBIR',
    },
    {
      cityName: 'JAKARTA',
      id: 'JAK',
      name: 'JAK - JAKARTA KOTA - (JAKARTA)',
      stationCode: 'JAK',
      stationName: 'JAKARTA KOTA',
    },
    {
      cityName: 'JAKARTA',
      id: 'JNG',
      name: 'JNG - JATINEGARA - (JAKARTA)',
      stationCode: 'JNG',
      stationName: 'JATINEGARA',
    },
    {
      cityName: 'JAKARTA',
      id: 'KBY',
      name: 'KBY - KEBAYORAN - (JAKARTA)',
      stationCode: 'KBY',
      stationName: 'KEBAYORAN',
    },
    {
      cityName: 'JAKARTA',
      id: 'MGB',
      name: 'MGB - MANGGA BESAR - (JAKARTA)',
      stationCode: 'MGB',
      stationName: 'MANGGA BESAR',
    },
    {
      cityName: 'JAKARTA',
      id: 'MRI',
      name: 'MRI - MANGGARAI - (JAKARTA)',
      stationCode: 'MRI',
      stationName: 'MANGGARAI',
    },
    {
      cityName: 'JAKARTA',
      id: 'PLM',
      name: 'PLM - PALMERAH - (JAKARTA)',
      stationCode: 'PLM',
      stationName: 'PALMERAH',
    },
    {
      cityName: 'JAKARTA',
      id: 'PSE',
      name: 'PSE - PASAR SENEN - (JAKARTA)',
      stationCode: 'PSE',
      stationName: 'PASAR SENEN',
    },
    {
      cityName: 'JAKARTA',
      id: 'THB',
      name: 'THB - TANAH ABANG - (JAKARTA)',
      stationCode: 'THB',
      stationName: 'TANAH ABANG',
    },
  ],
};

export const mockFetchTrainSearch: ResponseType<TrainSearchResponseType> = {
  success: true,
  message: 'Success',
  data: [
    {
      trainId: 'train-argo-bromo-exec-001',
      trainNumber: '1',
      trainName: 'Argo Bromo Anggrek',
      originStationCode: 'GMR',
      destinationStationCode: 'SBI',
      departureDate: '09-25-2026',
      departureTime: '08:00',
      arrivalDate: '09-25-2026',
      arrivalTime: '16:30',
      durationInMinutes: 510,
      trainClass: 'EXECUTIVE',
      subclass: 'A',
      availableSeats: 24,
      fare: {
        amount: 550000,
        currency: 'IDR',
      },
      summary: {
        name: 'Argo Bromo Anggrek (1)',
        trainClass: 'EXECUTIVE',
      },
    },
    {
      trainId: 'train-taksaka-biz-002',
      trainNumber: '72',
      trainName: 'Taksaka',
      originStationCode: 'GMR',
      destinationStationCode: 'YK',
      departureDate: '09-25-2026',
      departureTime: '09:15',
      arrivalDate: '09-25-2026',
      arrivalTime: '17:05',
      durationInMinutes: 470,
      trainClass: 'BUSINESS',
      subclass: 'B',
      availableSeats: 48,
      fare: {
        amount: 380000,
        currency: 'IDR',
      },
      summary: {
        name: 'Taksaka (72)',
        trainClass: 'BUSINESS',
      },
    },
    {
      trainId: 'train-bima-eco-003',
      trainNumber: '61',
      trainName: 'Bima',
      originStationCode: 'GMR',
      destinationStationCode: 'SBI',
      departureDate: '09-25-2026',
      departureTime: '17:00',
      arrivalDate: '09-26-2026',
      arrivalTime: '04:20',
      durationInMinutes: 680,
      trainClass: 'ECONOMY',
      subclass: 'C',
      availableSeats: 120,
      fare: {
        amount: 250000,
        currency: 'IDR',
      },
      summary: {
        name: 'Bima (61)',
        trainClass: 'ECONOMY',
      },
    },
    {
      trainId: 'train-cirebon-exp-004',
      trainNumber: '120',
      trainName: 'Cirebon Express',
      originStationCode: 'PSE',
      destinationStationCode: 'CNP',
      departureDate: '09-25-2026',
      departureTime: '06:30',
      arrivalDate: '09-25-2026',
      arrivalTime: '09:45',
      durationInMinutes: 195,
      trainClass: 'EXECUTIVE',
      subclass: 'A',
      availableSeats: 36,
      fare: {
        amount: 210000,
        currency: 'IDR',
      },
      summary: {
        name: 'Cirebon Express (120)',
        trainClass: 'EXECUTIVE',
      },
    },
    {
      trainId: 'train-matarmaja-eco-005',
      trainNumber: '251',
      trainName: 'Matarmaja',
      originStationCode: 'PSE',
      destinationStationCode: 'ML',
      departureDate: '09-25-2026',
      departureTime: '13:10',
      arrivalDate: '09-26-2026',
      arrivalTime: '04:55',
      durationInMinutes: 945,
      trainClass: 'ECONOMY',
      subclass: 'C',
      availableSeats: 200,
      fare: {
        amount: 175000,
        currency: 'IDR',
      },
      summary: {
        name: 'Matarmaja (251)',
        trainClass: 'ECONOMY',
      },
    },
  ],
};
