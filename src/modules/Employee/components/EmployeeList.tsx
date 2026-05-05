import { Table, Tag, Typography } from 'antd';

import type { UserType } from '@/types';

const { Text } = Typography;

type EmployeeListProps = {
  data: UserType[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (user: UserType) => void;
};

function EmployeeList({
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
}: EmployeeListProps) {
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
      onRow={(record) => ({
        onClick: () => onEdit(record),
      })}
      rowClassName="cursor-pointer"
      columns={[
        {
          title: 'Name',
          dataIndex: 'firstName',
          key: 'name',
          render: (_, record: UserType) => (
            <div>
              <div className="font-medium">
                {record.firstName} {record.lastName}
              </div>
              <Text type="secondary" className="text-xs">
                {record.title || '-'}
              </Text>
            </div>
          ),
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Phone',
          dataIndex: 'phoneNo',
          key: 'phoneNo',
          render: (value: string) => <span>{value || '-'}</span>,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (value: number) => (
            <Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? 'Active' : 'Inactive'}</Tag>
          ),
        },
      ]}
    />
  );
}

export default EmployeeList;
