import { useNavigate } from 'react-router-dom';

import { LOGIN_PATH } from '@/constants/routePath';
import { ACCESS_TOKEN } from '@/constants/storageKey';
import { localStorageClear, localStorageGet } from '@/utils/localStorage';
import { sessionStorageClear } from '@/utils/sessionStorage';

const useAuth = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const token = localStorageGet(ACCESS_TOKEN);
    if (!token) return false;
    return true;
  };

  const logout = () => {
    localStorageClear(); 
    sessionStorageClear();
    navigate(LOGIN_PATH);
  };

  return {
    isAuthenticated,
    logout,
  };
};

export default useAuth;
