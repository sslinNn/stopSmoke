import useSWR from 'swr';
import api from './api';

// Базовый fetcher для SWR
const fetcher = url => api.get(url).then(res => res.data);

// Хук для получения данных с автоматическим обновлением и кэшированием
export function useApi(url) {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  
  return {
    data,
    isLoading,
    isError: !!error,
    error,
    mutate // Функция для ручного обновления данных
  };
}

// Хук для получения данных о текущем пользователе
export function useCurrentUser() {
  return useApi('/users/me');
}

// Хук для получения данных с параметрами
export function useApiWithParams(url, params) {
  const fullUrl = params ? `${url}?${new URLSearchParams(params)}` : url;
  return useApi(fullUrl);
} 