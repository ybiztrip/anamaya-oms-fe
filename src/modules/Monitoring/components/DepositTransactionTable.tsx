import { Button, message, Modal, Space, Table } from 'antd';
import dayjs from 'dayjs';

import { BOOKING_STATUS_ISSUED, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import useETicket from '@/hooks/useETicket';
import useRefund from '@/hooks/useRefund';
import type {
  BookingETicketPayloadType,
  DepositMonitoringType,
  PaginationResponseType,
  RefundPayloadType,
} from '@/types';
import { formatIDR } from '@/utils/formatter';

type DepositTransactionTableProps = Readonly<{
  data?: PaginationResponseType<DepositMonitoringType>;
  isLoading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refreshData: () => void;
}>;

function DepositTransactionTable({
  data,
  isLoading,
  error,
  page,
  pageSize,
  setPage,
  setPageSize,
  refreshData,
}: DepositTransactionTableProps) {
  const { downloadETicket, isLoading: isDownloading } = useETicket();
  const { createRefund, isLoading: isCreatingRefund } = useRefund();
  const list = data?.data ?? [];
  const total = data?.totalElements ?? list.length;

  const onPageChange = (nextPage: number, nextSize: number) => {
    setPage(nextPage);
    if (nextSize !== pageSize) {
      setPageSize(nextSize);
    }
  };

  const handleViewETicket = async (record: DepositMonitoringType) => {
    try {
      const payload: BookingETicketPayloadType = {
        type: record.bookingType,
        partnerBookingId: String(record.referenceCode),
      };
      const blob = await downloadETicket(payload);
      const fileUrl = globalThis.URL.createObjectURL(blob);
      globalThis.open(fileUrl, '_blank');
      setTimeout(() => globalThis.URL.revokeObjectURL(fileUrl), 10000);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? err?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  };

  const handleRequestRefund = async (record: DepositMonitoringType) => {
    Modal.confirm({
      title: 'Request refund?',
      content: `Are you sure to request refund for transaction ${record.referenceCode}?`,
      okText: 'Yes, request',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const payload: RefundPayloadType = {
            bookingType: record.bookingType,
            ...(record.bookingType === 'FLIGHT'
              ? { bookingFlightId: Number(record.bookingFlights?.[0]?.bookingId) }
              : {}),
            ...(record.bookingType === 'HOTEL'
              ? { bookingHotelId: Number(record.bookingHotels?.[0]?.bookingId) }
              : {}),
            requestedAmount: record.amount,
            remarks: 'Request Refund',
          };
          await createRefund(payload);
          message.success('Refund request submitted successfully');
          refreshData();
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
            title: 'Transaction Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => (
              <span>{dayjs(createdAt).format('DD MMM YYYY HH:mm')}</span>
            ),
          },
          {
            title: 'Reference Code',
            dataIndex: 'referenceCode',
            key: 'referenceCode',
            render: (referenceCode: string) => <span>{referenceCode}</span>,
          },
          {
            title: 'Booker',
            dataIndex: 'contactEmail',
            key: 'contactEmail',
            render: (contactEmail: string) => <span>{contactEmail}</span>,
          },
          {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => <span>Rp{formatIDR(amount) || '-'}</span>,
          },
          {
            title: 'Begin Balance',
            dataIndex: 'beginBalance',
            key: 'beginBalance',
            render: (beginBalance: number) => <span>Rp{formatIDR(beginBalance) || '-'}</span>,
          },
          {
            title: 'End Balance',
            dataIndex: 'endBalance',
            key: 'endBalance',
            render: (endBalance: number) => <span>Rp{formatIDR(endBalance) || '-'}</span>,
          },
          {
            title: 'Actions',
            key: 'action',
            render: (_, record: DepositMonitoringType) => {
              const allowedETicketStatuses = new Set([BOOKING_STATUS_ISSUED]);
              const bookings =
                record.bookingType === 'FLIGHT' ? record.bookingFlights : record.bookingHotels;

              const isHasETicket =
                bookings &&
                bookings?.length > 0 &&
                bookings?.every((booking) =>
                  allowedETicketStatuses.has(String(booking?.status ?? '').toUpperCase()),
                );
              return (
                <Space>
                  {isHasETicket && (
                    <Button
                      type="primary"
                      loading={isDownloading}
                      onClick={() => handleViewETicket(record)}
                    >
                      E-Ticket
                    </Button>
                  )}
                  <Button
                    type="primary"
                    loading={isCreatingRefund}
                    onClick={() => handleRequestRefund(record)}
                    danger
                  >
                    Request Refund
                  </Button>
                </Space>
              );
            },
          },
        ]}
      />
    </>
  );
}

export default DepositTransactionTable;
