import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Хук для работы с аутентификацией пользователя
 * @returns {Object} Объект с данными пользователя и методами для работы с ними
 */
function useAuth() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * Проверка, авторизован ли пользователь
   * @returns {boolean} Статус авторизации
   */
  const isAuthenticated = () => {
    return !!userData;
  };

  return {
    userData,
    isLoading,
    error,
    isAuthenticated
  };
}

export default useAuth; 