import { Button, message, Modal, Space, Table } from 'antd';
import dayjs from 'dayjs';

import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type {
  PaginationResponseType,
  RefundCancelPayloadType,
  RefundListResponseType,
  RefundPaidPayloadType,
} from '@/types';
import { formatIDR } from '@/utils/formatter';

import useRefundActions from '../hooks/useRefundActions';

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
  const {
    payRefund,
    cancelRefund,
    isPaying,
    isCancelling,
    isLoading: isActionLoading,
  } = useRefundActions();
  const list = data?.data ?? [];
  const total = data?.totalElements ?? list.length;

  const onPageChange = (nextPage: number, nextSize: number) => {
    setPage(nextPage);
    if (nextSize !== pageSize) {
      setPageSize(nextSize);
    }
  };

  const handlePaidRefund = (record: RefundListResponseType) => {
    Modal.confirm({
      title: 'Mark refund as paid?',
      content: `Are you sure to pay refund for transaction ${record.bookingCode}?`,
      okText: 'Mark as paid',
      cancelText: 'Cancel',
      okButtonProps: { type: 'primary' },
      onOk: async () => {
        try {
          const payload: RefundPaidPayloadType = {
            type: record.bookingType,
            partnerBookingId: record.partnerBookingId,
            paidAmount: record.amount,
            remarks: 'Paid refund',
          };
          await payRefund(payload);
          message.success('Refund paid successfully');
        } catch (err: any) {
          message.error(err?.response?.data?.message ?? err?.message ?? DEFAULT_ERROR_MESSAGE);
        }
      },
    });
  };

  const handleCancelRefund = (record: RefundListResponseType) => {
    Modal.confirm({
      title: 'Cancel refund request?',
      content: `Are you sure to cancel refund for transaction ${record.bookingCode}?`,
      okText: 'Cancel refund',
      cancelText: 'Back',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const payload: RefundCancelPayloadType = {
            type: record.bookingType,
            partnerBookingId: record.partnerBookingId,
            paidAmount: record.amount,
            remarks: 'Cancel refund',
          };
          await cancelRefund({ id: record.id, payload });
          message.success('Refund cancelled successfully');
        } catch (err: any) {
          message.error(err?.response?.data?.message ?? err?.message ?? DEFAULT_ERROR_MESSAGE);
        }
      },
    });
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
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <span>{status ?? '-'}</span>,
          },
          {
            title: 'Action',
            key: 'action',
            render: (_, record: RefundListResponseType) => (
              <Space>
                <Button
                  type="primary"
                  loading={isPaying}
                  disabled={isActionLoading}
                  onClick={() => handlePaidRefund(record)}
                >
                  Paid
                </Button>
                <Button
                  danger
                  loading={isCancelling}
                  disabled={isActionLoading}
                  onClick={() => handleCancelRefund(record)}
                >
                  Cancel
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </>
  );
}

export default RefundTable;
