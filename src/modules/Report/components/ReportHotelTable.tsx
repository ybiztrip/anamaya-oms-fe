import { Table } from 'antd';
import dayjs from 'dayjs';

import DocumentLinks from '@/components/DocumentLinks';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { BookingHotelType, PaginationResponseType } from '@/types';
import { formatIDR } from '@/utils/formatter';

type ReportHotelTableProps = Readonly<{
  data?: PaginationResponseType<BookingHotelType>;
  isLoading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}>;

function ReportHotelTable({
  data,
  isLoading,
  error,
  page,
  pageSize,
  setPage,
  setPageSize,
}: ReportHotelTableProps) {
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
            render: (hotel: BookingHotelType) => (
              <DocumentLinks attachments={hotel?.metadata?.attachments} />
            ),
          },
          {
            title: 'Booker',
            key: 'booker',
            render: (hotel: BookingHotelType) => <span>{hotel?.metadata?.booker}</span>,
          },
          {
            title: 'Hotel',
            key: 'hotelName',
            render: (hotel: BookingHotelType) => <span>{hotel?.metadata?.hotelName}</span>,
          },
          {
            title: 'Room',
            key: 'roomName',
            render: (hotel: BookingHotelType) => <span>{hotel?.metadata?.hotelRoomName}</span>,
          },
          {
            title: 'Location',
            key: 'location',
            render: (hotel: BookingHotelType) => <span>{hotel?.metadata?.hotelCity}</span>,
          },
          {
            title: 'Check In Date',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            render: (checkInDate: string) => (
              <span>{dayjs(checkInDate).format('DD MMM YYYY')}</span>
            ),
          },
          {
            title: 'Check Out Date',
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            render: (checkOutDate: string) => (
              <span>{dayjs(checkOutDate).format('DD MMM YYYY')}</span>
            ),
          },
          {
            title: 'Guest Names',
            key: 'guestNames',
            render: (hotel: BookingHotelType) => (
              <span>{hotel?.metadata?.guestNames?.join(', ') ?? '-'}</span>
            ),
          },
          {
            title: 'Total Price',
            dataIndex: 'partnerSellAmount',
            key: 'partnerSellAmount',
            render: (partnerSellAmount: number) => (
              <span>Rp{formatIDR(partnerSellAmount) || '-'}</span>
            ),
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

export default ReportHotelTable;
