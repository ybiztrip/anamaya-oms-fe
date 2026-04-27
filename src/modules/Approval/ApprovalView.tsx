import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import Layout from '@/components/Layout';
import { PERMISSIONS } from '@/constants/permission';
import { isPermitted } from '@/utils/permission';

import MyApproval from './components/MyApproval';
import MyRequest from './components/MyRequest';
import NeedApproval from './components/NeedApproval';

function ApprovalView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeKey = useMemo(() => {
    const tab = searchParams.get('tab');
    const isPermittedApproval = isPermitted(PERMISSIONS.APPROVAL);
    const allowed = isPermittedApproval
      ? ['need-approval', 'my-approval', 'my-request']
      : ['my-request'];
    return allowed.includes(tab ?? '') ? tab! : allowed[0];
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
