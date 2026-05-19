import { ReloadOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import SectionCard from '@/components/SectionCard';
import { DEFAULT_ERROR_MESSAGE, DEPOSIT_CODE_FLIGHT } from '@/constants/common';
import { formatIDR } from '@/utils/formatter';

import useDepositBalance from '../hooks/useDepositBalance';

function DepositBalance() {
  const { data, isLoading, error, refreshDepositBalance } = useDepositBalance();

  const list = data?.data ?? [];
  const chartColors = ['#69A8FF', '#EF476F'];
  const chartData = list.map((item, index) => ({
    name: item.code === DEPOSIT_CODE_FLIGHT ? 'Flight' : 'Hotel',
    value: item.balance ?? 0,
    fill: chartColors[index % chartColors.length],
  }));

  return (
    <SectionCard className="mt-4" title="Balance Information">
      <div className="flex justify-end mb-4">
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={refreshDepositBalance}
          aria-label="Refresh balance"
        />
      </div>
      {error && (
        <div className="text-center text-sm text-red-500 mb-4">
          {error?.message ?? DEFAULT_ERROR_MESSAGE}
        </div>
      )}
      {chartData.length > 0 && (
        <div className="w-full h-64 mb-6">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              />
              <Tooltip formatter={(value) => `Rp${formatIDR(Number(value ?? 0))}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        pagination={false}
        columns={[
          {
            title: 'Product',
            dataIndex: 'code',
            key: 'code',
            render: (code: string) => (
              <span>{code === DEPOSIT_CODE_FLIGHT ? 'Flight' : 'Hotel'}</span>
            ),
          },
          {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance: number) => <span>Rp{formatIDR(balance) || '-'}</span>,
          },
        ]}
      />
    </SectionCard>
  );
}

export default DepositBalance;
