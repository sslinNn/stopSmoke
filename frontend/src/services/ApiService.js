/**
 * Заглушка сервиса для работы с API
 */
const apiService = {
  /**
   * GET-запрос
   * @param {string} url - URL запроса
   * @returns {Promise<any>} - Результат запроса
   */
  async get() {
    return { success: true };
  },
  
  /**
   * POST-запрос
   * @param {string} url - URL запроса
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} - Результат запроса
   */
  async post() {
    return { success: true };
  },
  
  /**
   * PATCH-запрос
   * @param {string} url - URL запроса
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} - Результат запроса
   */
  async patch() {
    return { success: true };
  },
  
  /**
   * DELETE-запрос
   * @param {string} url - URL запроса
   * @returns {Promise<any>} - Результат запроса
   */
  async delete() {
    return { success: true };
  },
  
  /**
   * Загрузка файла
   * @param {string} url - URL запроса
   * @param {FormData} formData - Данные формы с файлом
   * @returns {Promise<any>} - Результат запроса
   */
  async uploadFile() {
    return { success: true };
  }
};

export default apiService; 