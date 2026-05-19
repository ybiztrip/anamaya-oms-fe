import Layout from '@/components/Layout';

import DepositBalance from './components/DepositBalance';
import DepositTransactionHistory from './components/DepositTransactionHistory';

export default function MonitoringDepositView() {
  return (
    <Layout>
      <DepositBalance />
      <DepositTransactionHistory />
    </Layout>
  );
}
