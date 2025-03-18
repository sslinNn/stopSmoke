import api from './api';

// Функция для получения профиля пользователя
// export async function logCraving(data) {
//   const response = await api.post('/cravings/', data);
//   return response.data;
// }

// Функция для обновления профиля пользователя
export async function updateUserProfile(profileData) {
  const response = await api.put('/users/update', profileData);
  return response.data;
}


// Функция для загрузки аватара пользователя
export async function uploadAvatar(formData) {
  const response = await api.post('/users/update/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}