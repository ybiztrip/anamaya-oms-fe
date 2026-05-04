import { EditOutlined } from '@ant-design/icons';
import { Button, Table, Tag } from 'antd';
import dayjs from 'dayjs';

import { FLIGHT_CLASS_LABELS } from '@/constants/common';
import type { TravelPolicyType } from '@/types';
import { formatIDR } from '@/utils/formatter';

type TravelPolicyListProps = {
  data: TravelPolicyType[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (travelPolicy: TravelPolicyType) => void;
};

function TravelPolicyList({
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
}: TravelPolicyListProps) {
  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={data}
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
          title: 'Travel Policy',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Flight Price',
          key: 'flightPrice',
          render: (_, record: TravelPolicyType) => (
            <span>
              Rp{formatIDR(record.flightMinimumPrice) || '-'} - Rp
              {formatIDR(record.flightMaximumPrice) || '-'}
            </span>
          ),
        },
        {
          title: 'Flight Class',
          key: 'flightClass',
          render: (_, record: TravelPolicyType) => (
            <span>
              {FLIGHT_CLASS_LABELS[record.flightMinimumClass] || '-'} -{' '}
              {FLIGHT_CLASS_LABELS[record.flightMaximumClass] || '-'}
            </span>
          ),
        },
        {
          title: 'Hotel Price',
          key: 'hotelPrice',
          render: (_, record: TravelPolicyType) => (
            <span>
              Rp{formatIDR(record.hotelMinimumPrice) || '-'} - Rp
              {formatIDR(record.hotelMaximumPrice) || '-'}
            </span>
          ),
        },
        {
          title: 'Hotel Class',
          key: 'hotelClass',
          render: (_, record: TravelPolicyType) => (
            <span>
              {record.hotelMinimumClass || '-'} - {record.hotelMaximumClass || '-'}
            </span>
          ),
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (value: number) => (
            <Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? 'Active' : 'Inactive'}</Tag>
          ),
        },
        {
          title: 'Created Date',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (value: string) => <span>{dayjs(value).format('DD-MMM-YYYY')}</span>,
        },
        {
          title: 'Updated Date',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          render: (value: string) => <span>{dayjs(value).format('DD-MMM-YYYY')}</span>,
        },
        {
          title: 'Actions',
          key: 'actions',
          align: 'right',
          render: (_, record: TravelPolicyType) => (
            <Button
              shape="circle"
              icon={<EditOutlined />}
              loading={loading}
              onClick={() => onEdit(record)}
            />
          ),
        },
      ]}
    />
  );
}

export default TravelPolicyList;
