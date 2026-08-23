import { Table } from 'antd';
import dayjs from 'dayjs';

import DocumentLinks from '@/components/DocumentLinks';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import useFlightAirlines from '@/hooks/useFlightAirlines';
import useFlightAirport from '@/hooks/useFlightAirport';
import type { BookingFlightType, PaginationResponseType } from '@/types';
import { formatIDR } from '@/utils/formatter';

type ReportFlightTableProps = Readonly<{
  data?: PaginationResponseType<BookingFlightType>;
  isLoading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}>;

function ReportFlightTable({
  data,
  isLoading,
  error,
  page,
  pageSize,
  setPage,
  setPageSize,
}: ReportFlightTableProps) {
  const { airportsByCode } = useFlightAirport();
  const { airlinesByCode } = useFlightAirlines();

  const list = data?.data ?? [];
  const total = data?.totalElements ?? list.length;

  const onPageChange = (nextPage: number, nextSize: number) => {
    setPage(nextPage);
    if (nextSize !== pageSize) {
      setPageSize(nextSize);
    }
  };

  return (
    <>
      {error && (
        <div className="text-center text-sm text-red-500 mb-4">
          {error?.message ?? DEFAULT_ERROR_MESSAGE}
        </div>
      )}
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: onPageChange,
        }}
        columns={[
          {
            title: 'Booking Code',
            dataIndex: 'bookingCode',
            key: 'bookingCode',
            render: (bookingCode: string) => <span>{bookingCode}</span>,
          },
          {
            title: 'Attachments',
            key: 'attachments',
            render: (flight: BookingFlightType) => (
              <DocumentLinks attachments={flight?.metadata?.attachments} />
            ),
          },
          {
            title: 'Booker',
            key: 'booker',
            render: (hotel: BookingFlightType) => <span>{hotel?.metadata?.booker}</span>,
          },
          {
            title: 'Departure Date',
            dataIndex: 'departureDatetime',
            key: 'departureDatetime',
            render: (departureDatetime: string) => (
              <span>{dayjs(departureDatetime).format('DD MMM YYYY HH:mm')}</span>
            ),
          },
          {
            title: 'Airline',
            key: 'airline',
            render: (flight: BookingFlightType) => (
              <span>
                {flight?.metadata?.airlines
                  ?.map((airline) => airlinesByCode[airline]?.airlineName ?? '-')
                  .join(', ') ?? '-'}
              </span>
            ),
          },
          {
            title: 'Flight Code',
            key: 'flightCode',
            render: (flight: BookingFlightType) => (
              <span>{flight?.metadata?.flightCodes?.join(', ') ?? '-'}</span>
            ),
          },
          {
            title: 'Departure Airport',
            dataIndex: 'origin',
            key: 'originAirport',
            render: (origin: string) => (
              <span>
                {airportsByCode[origin]?.localAirportName ?? '-'} ({origin})
              </span>
            ),
          },
          {
            title: 'Departure City',
            dataIndex: 'origin',
            key: 'originCity',
            render: (origin: string) => <span>{airportsByCode[origin]?.localCityName ?? '-'}</span>,
          },
          {
            title: 'Departure Terminal',
            key: 'departureTerminal',
            render: (flight: BookingFlightType) => (
              <span>
                {typeof flight?.metadata?.departureTerminal === 'string'
                  ? `T${flight?.metadata?.departureTerminal}`
                  : (flight?.metadata?.departureTerminal
                      ?.map((terminal) => `T${terminal}`)
                      .join(', ') ?? '-')}
              </span>
            ),
          },
          {
            title: 'Arrival Date',
            dataIndex: 'arrivalDatetime',
            key: 'arrivalDatetime',
            render: (arrivalDatetime: string) => (
              <span>{dayjs(arrivalDatetime).format('DD MMM YYYY HH:mm')}</span>
            ),
          },
          {
            title: 'Arrival Airport',
            dataIndex: 'destination',
            key: 'destinationAirport',
            render: (destination: string) => (
              <span>
                {airportsByCode[destination]?.localAirportName ?? '-'} ({destination})
              </span>
            ),
          },
          {
            title: 'Arrival City',
            dataIndex: 'destination',
            key: 'destinationCity',
            render: (destination: string) => (
              <span>{airportsByCode[destination]?.localCityName ?? '-'}</span>
            ),
          },
          {
            title: 'Arrival Terminal',
            key: 'arrivalTerminal',
            render: (flight: BookingFlightType) => (
              <span>
                {typeof flight?.metadata?.arrivalTerminal === 'string'
                  ? `T${flight?.metadata?.arrivalTerminal}`
                  : (flight?.metadata?.arrivalTerminal
                      ?.map((terminal) => `T${terminal}`)
                      .join(', ') ?? '-')}
              </span>
            ),
          },
          {
            title: 'Passenger Names',
            key: 'passengerNames',
            render: (flight: BookingFlightType) => (
              <span>{flight?.metadata?.passengerNames?.join(', ') ?? '-'}</span>
            ),
          },
          {
            title: 'Baggage Price',
            key: 'baggagePrice',
            render: (flight: BookingFlightType) => (
              <span>
                Rp
                {formatIDR(
                  flight?.metadata?.prices?.find((price) => price.item.includes('Baggage'))?.amount,
                ) || '-'}
              </span>
            ),
          },
          {
            title: 'Base Price',
            key: 'basePrice',
            render: (flight: BookingFlightType) => (
              <span>
                Rp
                {formatIDR(
                  flight?.metadata?.prices
                    ?.filter((price) =>
                      ['(Adult)', '(Child)', '(Infant)'].some((label) =>
                        price.item.includes(label),
                      ),
                    )
                    .reduce((sum, price) => sum + Number(price.amount ?? 0), 0) ?? 0,
                ) || '-'}
              </span>
            ),
          },
          {
            title: 'Total Price',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (totalAmount: number) => <span>Rp{formatIDR(totalAmount) || '-'}</span>,
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
          },
        ]}
      />
    </>
  );
}

export default ReportFlightTable;
