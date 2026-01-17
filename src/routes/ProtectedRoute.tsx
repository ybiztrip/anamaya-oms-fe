import { Navigate } from 'react-router-dom';

import { LOGIN_PATH } from '@/constants/routePath';
import useAuth from '@/hooks/useAuth';

export default function ProtectedRoute({ children }: any) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    localStorage.clear();
    return <Navigate to={LOGIN_PATH} replace />;
  }
  return children;
}
