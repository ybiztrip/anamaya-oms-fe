import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { BOOKING_PARAMS } from '@/constants/storageKey';
import { sessionStorageRemove } from '@/utils/sessionStorage';

export default function CreateFlowShell() {
  useEffect(() => {
    return () => {
      sessionStorageRemove(BOOKING_PARAMS);
    };
  }, []);

  return <Outlet />;
}
