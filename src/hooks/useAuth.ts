import { useNavigate } from 'react-router-dom';

import { LOGIN_PATH } from '@/constants/routePath';

const useAuth = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    return true;
  };

  const logout = () => {
    localStorage.clear();
    navigate(LOGIN_PATH);
  };

  return {
    isAuthenticated,
    logout,
  };
};

export default useAuth;
