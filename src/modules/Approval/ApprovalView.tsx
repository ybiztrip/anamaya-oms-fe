import { Tabs } from 'antd';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import Layout from '@/components/Layout';

import MyApproval from './components/MyApproval';
import MyRequest from './components/MyRequest';
import NeedApproval from './components/NeedApproval';

function ApprovalView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeKey = useMemo(() => {
    const tab = searchParams.get('tab');
    const allowed = ['need-approval', 'my-approval', 'my-request'];
    return allowed.includes(tab ?? '') ? tab! : 'need-approval';
  }, [searchParams]);

  return (
    <Layout>
      <Tabs
        className="mt-4"
        activeKey={activeKey}
        onChange={(key) => setSearchParams({ tab: key })}
        size="large"
        centered
        items={[
          { key: 'need-approval', label: 'Need Approval', children: <NeedApproval /> },
          { key: 'my-approval', label: 'My Approval', children: <MyApproval /> },
          { key: 'my-request', label: 'My Request', children: <MyRequest /> },
        ]}
      />
    </Layout>
  );
}
export default ApprovalView;
