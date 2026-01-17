import { Tabs } from 'antd';

import Layout from '@/components/Layout';

import MyApproval from './components/MyApproval';
import MyRequest from './components/MyRequest';
import NeedApproval from './components/NeedApproval';

function ApprovalView() {
  return (
    <Layout>
      <Tabs
        className="mt-4"
        defaultActiveKey="need-approval"
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
