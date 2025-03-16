import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useAuth() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include'
      });

      if (response.status === 401) {
        // Пользователь не авторизован
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Не удалось загрузить данные профиля');
      }

      const data = await response.json();
      setUserData(data.user_data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = (newData) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
  };

  return {
    userData,
    isLoading,
    error,
    updateUserData,
    refreshUserData: fetchUserData
  };
}

export default useAuth; 