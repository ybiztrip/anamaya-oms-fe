import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import { LOGIN_PATH } from '@/constants/routePath';
import dayjs from '@/utils/dayjs';

const useAuth = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp) {
        console.log('token exp', dayjs(decoded.exp * 1000).format('YYYY-MM-DD HH:mm:ss'));
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
      }
      return false;
    } catch (e: any) {
      console.log(e);
      return false;
    }
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
