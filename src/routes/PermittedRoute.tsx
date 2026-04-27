import { Navigate } from 'react-router-dom';

import { HOME_PATH } from '@/constants/routePath';
import { isPermitted } from '@/utils/permission';

export default function PermittedRoute({
  children,
  permission,
}: {
  children: React.ReactNode;
  permission: string;
}) {
  if (!isPermitted(permission)) {
    return <Navigate to={HOME_PATH} replace />;
  }
  return children;
}
