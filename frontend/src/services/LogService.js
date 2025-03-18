import logger from '../utils/logger';

/**
 * Расширенный сервис для логирования с дополнительными категориями
 */
const LogService = {
  /**
   * Логирование информации об аутентификации
   * @param {string} message - Сообщение для логирования
   * @param {Object} [data] - Дополнительные данные
   */
  auth: (message, data) => {
    logger.auth(message, data);
  },
  
  /**
   * Логирование ошибок
   * @param {string} message - Сообщение об ошибке
   * @param {Error|Object} [error] - Объект ошибки
   */
  error: (message, error) => {
    logger.error(message, error);
  },
  
  /**
   * Логирование информационных сообщений
   * @param {string} message - Информационное сообщение
   * @param {Object} [data] - Дополнительные данные
   */
  info: (message, data) => {
    logger.info(message, data);
  },
  
  /**
   * Логирование предупреждений
   * @param {string} message - Предупреждение
   * @param {Object} [data] - Дополнительные данные
   */
  warn: (message, data) => {
    logger.warn(message, data);
  },
  
  /**
   * Логирование информации о прогрессе
   * @param {string} message - Сообщение для логирования
   * @param {Object} [data] - Дополнительные данные о прогрессе
   */
  progress: (message, data) => {
    console.info(`[Progress] ${message}`, data || '');
  },
  
  /**
   * Логирование информации о достижениях
   * @param {string} message - Сообщение для логирования
   * @param {Object} [data] - Дополнительные данные о достижениях
   */
  achievements: (message, data) => {
    console.info(`[Achievements] ${message}`, data || '');
  },
  
  /**
   * Логирование отладочной информации
   * @param {string} message - Сообщение для логирования
   * @param {Object} [data] - Дополнительные данные
   */
  debug: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[Debug] ${message}`, data || '');
    }
  }
};

export default LogService; 