import { ReloadOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import dayjs from 'dayjs';

import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { DepositMonitoringType, PaginationResponseType } from '@/types';
import { formatIDR } from '@/utils/formatter';

type DepositTransactionTableProps = Readonly<{
  data?: PaginationResponseType<DepositMonitoringType>;
  isLoading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refreshDepositTransactions: () => void;
}>;

function DepositTransactionTable({
  data,
  isLoading,
  error,
  page,
  pageSize,
  setPage,
  setPageSize,
  refreshDepositTransactions,
}: DepositTransactionTableProps) {
  const list = data?.data ?? [];
  const total = data?.totalElements ?? list.length;

  const onPageChange = (nextPage: number, nextSize: number) => {
    setPage(nextPage);
    if (nextSize !== pageSize) {
      setPageSize(nextSize);
    }
  };

  const handleViewETicket = (id: number) => {
    // TODO: implement view e-ticket
    console.log(id);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={refreshDepositTransactions}
          aria-label="Refresh balance"
        />
      </div>
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
            render: (_, record: DepositMonitoringType) => (
              <Button type="primary" onClick={() => handleViewETicket(record.id)}>
                E-Ticket
              </Button>
            ),
          },
        ]}
      />
    </>
  );
}

export default DepositTransactionTable;
