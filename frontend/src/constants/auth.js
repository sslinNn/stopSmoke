// Константы для эндпоинтов аутентификации
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/users/me',
};

// Глобальная переменная для хранения версии аватара
let avatarVersion = Date.now();

// Функция для обновления версии аватара
export const updateAvatarVersion = () => {
  avatarVersion = Date.now();
};

// Функция для получения URL аватара с контролируемым кэшированием
export const AVATAR = (user) => {
  if (!user?.avatar_url) return "https://placehold.co/100x100?text=User";
  
  // Используем одну версию для всей сессии, обновляем только при изменении аватара
  return `http://127.0.0.1:8000/${user.avatar_url}?v=${avatarVersion}`;
};

// Ключ для хранения состояния аутентификации в localStorage
export const AUTH_STORAGE_KEY = 'auth_state'; 