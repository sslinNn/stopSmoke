/**
 * Простой логгер для приложения
 */
const logger = {
  /**
   * Логирование информации об аутентификации
   * @param {string} message - Сообщение для логирования
   * @param {Object} [data] - Дополнительные данные
   */
  auth: (message, data) => {
    console.log(`[Auth] ${message}`, data || '');
  },
  
  /**
   * Логирование ошибок
   * @param {string} message - Сообщение об ошибке
   * @param {Error|Object} [error] - Объект ошибки
   */
  error: (message, error) => {
    console.error(`[Error] ${message}`, error || '');
  },
  
  /**
   * Логирование информационных сообщений
   * @param {string} message - Информационное сообщение
   * @param {Object} [data] - Дополнительные данные
   */
  info: (message, data) => {
    console.info(`[Info] ${message}`, data || '');
  },
  
  /**
   * Логирование предупреждений
   * @param {string} message - Предупреждение
   * @param {Object} [data] - Дополнительные данные
   */
  warn: (message, data) => {
    console.warn(`[Warning] ${message}`, data || '');
  }
};

export default logger; 