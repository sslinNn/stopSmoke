import axios from 'axios';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: '/api', // Используем прокси, настроенный в vite.config.js
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Разрешаем отправку cookies
  credentials: 'include' // Включаем cookies для кросс-доменных запросов
});

// Добавляем перехватчик ответов для обработки ошибок
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Обработка ошибки 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Перенаправляем на страницу входа
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 