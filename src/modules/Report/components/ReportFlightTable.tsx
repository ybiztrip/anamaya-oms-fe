import { Table } from 'antd';
import dayjs from 'dayjs';

import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
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
            title: 'Departure Date',
            dataIndex: 'departureDatetime',
            key: 'departureDatetime',
            render: (departureDatetime: string) => (
              <span>{dayjs(departureDatetime).format('DD MMM YYYY HH:mm')}</span>
            ),
          },
          {
            title: 'Departure Airport',
            dataIndex: 'origin',
            key: 'origin',
            render: (origin: string) => <span>{airportsByCode[origin]?.localAirportName ?? '-'} ({origin})</span>,
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
            key: 'destination',
            render: (destination: string) => <span>{airportsByCode[destination]?.localAirportName ?? '-'} ({destination})</span>,
          },
          {
            title: 'Total Amount',
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
