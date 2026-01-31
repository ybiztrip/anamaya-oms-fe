import axios from 'axios';

import { BASE_API } from '@/constants/api';
import { LOGIN_PATH } from '@/constants/routePath';
import { ACCESS_TOKEN } from '@/constants/storageKey';

import { localStorageGet, localStorageRemove } from './localStorage';

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
    if (error.response?.status === 401) {
      console.warn('Token expired or unauthorized');
      localStorageRemove(ACCESS_TOKEN);
      window.location.href = LOGIN_PATH;
    }
    return Promise.reject(error);
  },
);

export default api;
