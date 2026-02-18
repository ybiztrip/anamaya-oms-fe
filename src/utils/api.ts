import axios from 'axios';

import { BASE_API } from '@/constants/api';
import { LOGIN_PATH } from '@/constants/routePath';
import { ACCESS_TOKEN } from '@/constants/storageKey';
import { localStorageClear, localStorageGet } from '@/utils/localStorage';
import { sessionStorageClear } from '@/utils/sessionStorage';

let redirecting = false;

const api = axios.create({
  baseURL: BASE_API,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorageGet(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string | undefined = error.config?.url;

    const isAuthFailure = status === 401 || status === 403;
    const isLoginCall = url?.includes('/auth/login');

    if (isAuthFailure && !isLoginCall && !redirecting) {
      redirecting = true;
      localStorageClear();
      sessionStorageClear();
      window.location.replace(LOGIN_PATH);
    }

    return Promise.reject(error);
  },
);

export default api;
