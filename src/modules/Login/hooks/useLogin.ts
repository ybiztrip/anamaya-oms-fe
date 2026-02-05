import { Form, type FormInstance, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AUTH_LOGIN_API } from '@/constants/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { HOME_PATH } from '@/constants/routePath';
import { ACCESS_TOKEN, USER } from '@/constants/storageKey';
import axios from '@/utils/api';
import { localStorageSet } from '@/utils/localStorage';

export type useLoginProps = {
  isLoading: boolean;
  form: FormInstance;
  login: any;
};

const useLogin = () => {
  const { useForm } = Form;
  const [form] = useForm();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (values: any) => {
    setIsLoading(true);
    const apiURL = AUTH_LOGIN_API;
    const payload = {
      email: values.username,
      password: values.password,
    };
    const result = await axios
      .post(apiURL, payload)
      .then((response) => {
        console.log('response', response);
        setIsLoading(false);
        const { token } = response.data.data;
        localStorageSet(ACCESS_TOKEN, token);
        localStorageSet(USER, response.data.data);
        navigate(HOME_PATH);
      })
      .catch((e: any) => {
        if (e?.response?.data?.message) {
          message.error(e?.response?.data?.message);
        } else {
          message.error(DEFAULT_ERROR_MESSAGE);
        }
        setIsLoading(false);
      });
    return result;
  };

  return {
    isLoading,
    form,
    login,
  };
};

export default useLogin;
