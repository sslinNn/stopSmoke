import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

// Кэш для хранения запросов в процессе выполнения
const pendingRequests = {};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Централизованная функция для выполнения запросов с дедупликацией
  const makeRequest = useCallback(async (url, options = {}) => {
    const cacheKey = `${options.method || 'GET'}-${url}-${JSON.stringify(options.body || {})}`;
    
    // Если такой запрос уже выполняется, возвращаем существующий промис
    if (pendingRequests[cacheKey]) {
      return pendingRequests[cacheKey];
    }
    
    // Создаем новый запрос и сохраняем его в кэше
    const requestPromise = fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include'
    })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Ошибка ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .finally(() => {
      // Удаляем запрос из кэша после завершения
      delete pendingRequests[cacheKey];
    });
    
    pendingRequests[cacheKey] = requestPromise;
    return requestPromise;
  }, []);

  // Проверка аутентификации пользователя
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await makeRequest('/api/users/me');
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setError('Не удалось получить данные пользователя');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [makeRequest]);

  // Загрузка данных о прогрессе
  const fetchProgressData = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    try {
      const data = await makeRequest('/api/progress');
      setProgressData(data);
      return data;
    } catch (err) {
      console.error('Ошибка при загрузке данных о прогрессе:', err);
      throw err;
    }
  }, [isAuthenticated, makeRequest]);

  // Загрузка достижений
  const fetchAchievements = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    try {
      const data = await makeRequest('/api/achievements');
      setAchievements(data);
      return data;
    } catch (err) {
      console.error('Ошибка при загрузке достижений:', err);
      throw err;
    }
  }, [isAuthenticated, makeRequest]);

  // Установка даты отказа от курения
  const setQuitDate = useCallback(async (quitDateData) => {
    try {
      const data = await makeRequest('/api/progress/quit-date', {
        method: 'POST',
        body: JSON.stringify(quitDateData)
      });
      
      // Обновляем данные пользователя и прогресса
      await checkAuth();
      setProgressData(data);
      
      // Загружаем достижения, так как могли появиться новые
      await fetchAchievements();
      
      return { success: true, data };
    } catch (err) {
      console.error('Ошибка при установке даты отказа от курения:', err);
      return { success: false, error: err.message };
    }
  }, [makeRequest, checkAuth, fetchAchievements]);

  // Логирование тяги к курению
  const logCraving = useCallback(async (cravingData) => {
    try {
      const data = await makeRequest('/api/cravings', {
        method: 'POST',
        body: JSON.stringify(cravingData)
      });
      
      // Обновляем данные о прогрессе
      await fetchProgressData();
      
      // Проверяем, есть ли новые достижения
      const newAchievements = data.new_achievements || [];
      
      if (newAchievements.length > 0) {
        // Обновляем список достижений
        await fetchAchievements();
      }
      
      return { 
        success: true, 
        data, 
        newAchievements 
      };
    } catch (err) {
      console.error('Ошибка при логировании тяги:', err);
      return { success: false, error: err.message };
    }
  }, [makeRequest, fetchProgressData, fetchAchievements]);

  // Вход в систему
  const login = useCallback(async (credentials) => {
    try {
      await makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      // Получаем данные пользователя
      const userData = await checkAuth();
      
      if (userData) {
        // Загружаем данные о прогрессе и достижениях
        await Promise.all([
          fetchProgressData(),
          fetchAchievements()
        ]);
        
        return { success: true };
      }
      
      return { success: false, error: 'Не удалось получить данные пользователя' };
    } catch (err) {
      console.error('Ошибка при входе в систему:', err);
      return { success: false, error: err.message };
    }
  }, [makeRequest, checkAuth, fetchProgressData, fetchAchievements]);

  // Регистрация
  const register = useCallback(async (userData) => {
    try {
      await makeRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      // После регистрации выполняем вход
      return login({
        email: userData.email,
        password: userData.password
      });
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      return { success: false, error: err.message };
    }
  }, [makeRequest, login]);

  // Выход из системы
  const logout = useCallback(async () => {
    try {
      await makeRequest('/api/auth/logout', {
        method: 'GET'
      });
      
      // Сбрасываем состояние
      setUser(null);
      setIsAuthenticated(false);
      setProgressData(null);
      setAchievements(null);
      
      // Перенаправляем на главную страницу
      navigate('/');
      
      return { success: true };
    } catch (err) {
      console.error('Ошибка при выходе из системы:', err);
      return { success: false, error: err.message };
    }
  }, [makeRequest, navigate]);

  // Сброс кэша данных
  const resetCache = useCallback(() => {
    setProgressData(null);
    setAchievements(null);
  }, []);

  // Обновление профиля пользователя
  const updateUserProfile = useCallback(async (profileData) => {
    try {
      const data = await makeRequest('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      
      // Обновляем данные пользователя
      setUser(data);
      
      return { success: true, data };
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      return { success: false, error: err.message };
    }
  }, [makeRequest]);

  // Обновление аватара пользователя
  const updateUserAvatar = useCallback(async (formData) => {
    try {
      // Для загрузки файлов не используем JSON
      const response = await fetch('/api/users/me/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Ошибка ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Обновляем данные пользователя
      setUser(prevUser => ({
        ...prevUser,
        avatar_url: data.avatar_url
      }));
      
      return { success: true, data };
    } catch (err) {
      console.error('Ошибка при обновлении аватара:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Проверяем аутентификацию при загрузке приложения
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    progressData,
    achievements,
    login,
    register,
    logout,
    checkAuth,
    fetchProgressData,
    fetchAchievements,
    setQuitDate,
    logCraving,
    resetCache,
    updateUserProfile,
    updateUserAvatar
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

export default UserContext; 