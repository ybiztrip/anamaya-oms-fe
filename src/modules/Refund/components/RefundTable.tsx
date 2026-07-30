import { Table } from 'antd';
import dayjs from 'dayjs';

import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { PaginationResponseType, RefundListResponseType } from '@/types';
import { formatIDR } from '@/utils/formatter';

type RefundTableProps = Readonly<{
  data?: PaginationResponseType<RefundListResponseType>;
  isLoading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}>;

function RefundTable({
  data,
  isLoading,
  error,
  page,
  pageSize,
  setPage,
  setPageSize,
}: RefundTableProps) {
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
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => <span>{formatIDR(amount)}</span>,
          },

          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => <span>{dayjs(date).format('DD MMM YYYY HH:mm')}</span>,
          },
        ]}
      />
    </>
  );
}

export default RefundTable;
