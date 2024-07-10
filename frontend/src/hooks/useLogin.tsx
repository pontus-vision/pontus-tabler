import { useContext, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import useApiAndNavigate from './useApi';
import { loginUser } from '../client';
import { LoginRes } from '../typescript/api';
import { getUserIdFromToken } from '../../utils';
import { useAuth } from '../AuthContext';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchDataAndNavigate } = useApiAndNavigate();
  const { login } = useAuth();

  const handleLogin = async (
    username: string,
    password: string,
  ): Promise<AxiosResponse<LoginRes, any>> => {
    // e.preventDefault();
    setLoading(true);

    const res = (await fetchDataAndNavigate(loginUser, {
      password,
      username,
    })) as AxiosResponse<LoginRes>;

    if (res.status === 200) {
      localStorage.setItem('accessToken', 'Bearer ' + res.data.accessToken);
      localStorage.setItem('refreshToken', 'Bearer ' + res.data.refreshToken);
      console.log({ resData: res.data });
      const userId = getUserIdFromToken();
      await login(userId);
    }

    setLoading(false);
    return res;
  };
  return { handleLogin, loading };
};

export default useLogin;
