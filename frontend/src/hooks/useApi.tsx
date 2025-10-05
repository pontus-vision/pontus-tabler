import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const useApiAndNavigate = () => {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDataAndNavigate = async (
    func: (data: any) => Promise<any>,
    data: any,
    url: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await func(data);
      // Assuming response data contains necessary information for navigation logic
      // For example, response.data.success or any other condition

      if (res?.status === 307) {
        navigate('/register/admin');
      }

      if (res?.status === 200 && url) {
        navigate(url)
      }

      return res;
    } catch (error) {
      if (error?.response?.status === 403) {
        navigate('/unauthorized')
      }
      if (error?.response?.status === 401) {
        navigate('/login')
      }
      throw error

    } finally {
      setLoading(false);
    }
  };

  return { fetchDataAndNavigate, loading, error };
};

export default useApiAndNavigate;
