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

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  return (
    <Layout>
      {activeKey === 'need-approval' && <NeedApproval onChangeTab={handleChangeTab} />}
      {activeKey === 'my-request' && <MyRequest onChangeTab={handleChangeTab} />}
      {activeKey === 'my-approval' && <MyApproval onChangeTab={handleChangeTab} />}
    </Layout>
  );
}
export default ApprovalView;
