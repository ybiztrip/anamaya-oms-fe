import type {
  AirlineType,
  AirportType,
  FlightBookingAddOnsResponseType,
  FlightSearchOneWayResponseType,
  ResponseType,
} from '@/types';

export const mockFetchAirports: ResponseType<AirportType[]> = {
  success: true,
  message: 'Success',
  data: [
    {
      airportCode: 'CGK',
      city: 'Jakarta',
      countryId: 'ID',
      countryCode: '360',
      areaCode: 'JKTA',
      timeZone: 'Asia/Jakarta',
      internationalAirportName: 'Soekarno Hatta International Airport',
      airportIcaoCode: 'WIII',
      localAirportName: 'Soekarno Hatta International Airport',
      localCityName: 'Jakarta',
      countryName: 'Indonesia',
    },
    {
      airportCode: 'DPS',
      city: 'Bali / Denpasar',
      countryId: 'ID',
      countryCode: '360',
      areaCode: 'DPS',
      timeZone: 'Asia/Ujung_Pandang',
      internationalAirportName: 'Ngurah Rai International Airport',
      airportIcaoCode: 'WADD',
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
