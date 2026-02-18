import type {
  AirlineType,
  AirportType,
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
  message: 'OK',
  data: {
    completed: true,
    oneWayFlightSearchResults: [
      {
        flightId: 'FLIGHT-001',
        departureAirport: 'CGK',
        arrivalAirport: 'DPS',
        numOfTransits: '0',
        tripDuration: '02h10m',
        journeys: [
          {
            numOfTransits: '0',
            journeyDuration: '02h10m',
            daysOffset: '0',
            refundableStatus: 'REFUNDABLE',
            departureDetail: {
              airportCode: 'CGK',
              departureDate: '2026-02-20',
              departureTime: '07:30',
              departureTerminal: '3',
            },
            arrivalDetail: {
              airportCode: 'DPS',
              arrivalDate: '2026-02-20',
              arrivalTime: '09:40',
              arrivalTerminal: 'D',
            },
            fareInfo: {
              currency: 'IDR',
              total: 1850000,
              cabinClass: 'ECONOMY',
            },
            segments: [
              {
                marketingAirline: 'GA',
                flightNumber: 'GA412',
                aircraft: 'B738',
                from: 'CGK',
                to: 'DPS',
                dep: '2026-02-10T07:30:00+07:00',
                arr: '2026-02-10T09:40:00+08:00',
              },
            ],
          },
        ],
      },
      {
        flightId: 'FLIGHT-002',
        departureAirport: 'CGK',
        arrivalAirport: 'DPS',
        numOfTransits: '1',
        tripDuration: '04h30m',
        journeys: [
          {
            numOfTransits: '1',
            journeyDuration: '04h30m',
            daysOffset: '0',
            refundableStatus: 'NON_REFUNDABLE',
            departureDetail: {
              airportCode: 'CGK',
              departureDate: '2026-02-20',
              departureTime: '10:00',
              departureTerminal: '2',
            },
            arrivalDetail: {
              airportCode: 'DPS',
              arrivalDate: '2026-02-20',
              arrivalTime: '14:30',
              arrivalTerminal: 'I',
            },
            fareInfo: { currency: 'IDR', total: 1450000, cabinClass: 'ECONOMY' },
            segments: [
              { from: 'CGK', to: 'SUB', flightNumber: 'ID6578' },
              { from: 'SUB', to: 'DPS', flightNumber: 'ID6891' },
            ],
          },
        ],
      },
    ],
  },
};
