import api from './api';

/**
 * Загружает файл на сервер
 * @param {string} endpoint - Эндпоинт для загрузки файла
 * @param {FormData} formData - Данные формы с файлом
 * @returns {Promise<Object>} - Ответ от сервера
 */
export async function uploadFile(endpoint, formData) {
  const response = await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export default {
  uploadFile,
}; 