/**
 * Централизованный сервис логирования для приложения
 * Позволяет управлять уровнем логирования и предотвращает дублирование логов
 */
class LogService {
  constructor() {
    // Уровни логирования
    this.LOG_LEVELS = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      NONE: 100 // Отключение всех логов
    };
    
    // Текущий уровень логирования (по умолчанию INFO)
    this.currentLogLevel = parseInt(localStorage.getItem('logLevel')) || this.LOG_LEVELS.INFO;
    
    // Цвета для разных типов логов
    this.colors = {
      debug: 'color: #6c757d',
      info: 'color: #0d6efd',
      warn: 'color: #ffc107; font-weight: bold',
      error: 'color: #dc3545; font-weight: bold',
      api: 'color: #20c997',
      auth: 'color: #6610f2',
      progress: 'color: #0dcaf0',
      achievements: 'color: #fd7e14'
    };
    
    // Кэш для предотвращения дублирования логов
    this.logCache = {};
    this.throttleTime = 1000; // 1 секунда
  }
  
  /**
   * Установка уровня логирования
   * @param {string} level - Уровень логирования (DEBUG, INFO, WARN, ERROR, NONE)
   */
  setLogLevel(level) {
    if (this.LOG_LEVELS[level] !== undefined) {
      this.currentLogLevel = this.LOG_LEVELS[level];
      localStorage.setItem('logLevel', this.currentLogLevel);
      this.info(`Уровень логирования установлен: ${level}`);
    } else {
      this.warn(`Неизвестный уровень логирования: ${level}`);
    }
  }
  
  /**
   * Очистка кэша логов
   * Используется для сброса механизма предотвращения дублирования
   */
  clearCache() {
    this.logCache = {};
    this.info('Кэш логов очищен');
  }
  
  /**
   * Проверка, должно ли сообщение быть залогировано
   * @param {number} messageLevel - Уровень сообщения
   * @returns {boolean} - true, если сообщение должно быть залогировано
   */
  shouldLog(messageLevel) {
    return messageLevel >= this.currentLogLevel;
  }
  
  /**
   * Предотвращение дублирования логов
   * @param {string} type - Тип лога
   * @param {string} message - Сообщение
   * @returns {boolean} - true, если сообщение не дублируется
   */
  preventDuplicates(type, message) {
    const key = `${type}:${message}`;
    const now = Date.now();
    
    if (this.logCache[key] && now - this.logCache[key] < this.throttleTime) {
      return false;
    }
    
    this.logCache[key] = now;
    return true;
  }
  
  /**
   * Логирование отладочных сообщений
   * @param {string} message - Сообщение
   * @param {any} data - Дополнительные данные
   */
  debug(message, data) {
    if (!this.shouldLog(this.LOG_LEVELS.DEBUG)) return;
    if (!this.preventDuplicates('debug', message)) return;
    
    if (data) {
      console.log(`%c[DEBUG] ${message}`, this.colors.debug, data);
    } else {
      console.log(`%c[DEBUG] ${message}`, this.colors.debug);
    }
  }
  
  /**
   * Логирование информационных сообщений
   * @param {string} message - Сообщение
   * @param {any} data - Дополнительные данные
   */
  info(message, data) {
    if (!this.shouldLog(this.LOG_LEVELS.INFO)) return;
    if (!this.preventDuplicates('info', message)) return;
    
    if (data) {
      console.log(`%c[INFO] ${message}`, this.colors.info, data);
    } else {
      console.log(`%c[INFO] ${message}`, this.colors.info);
    }
  }
  
  /**
   * Логирование предупреждений
   * @param {string} message - Сообщение
   * @param {any} data - Дополнительные данные
   */
  warn(message, data) {
    if (!this.shouldLog(this.LOG_LEVELS.WARN)) return;
    
    if (data) {
      console.warn(`%c[WARN] ${message}`, this.colors.warn, data);
    } else {
      console.warn(`%c[WARN] ${message}`, this.colors.warn);
    }
  }
  
  /**
   * Логирование ошибок
   * @param {string} message - Сообщение
   * @param {Error|any} error - Объект ошибки или дополнительные данные
   */
  error(message, error) {
    if (!this.shouldLog(this.LOG_LEVELS.ERROR)) return;
    
    if (error instanceof Error) {
      console.error(`%c[ERROR] ${message}`, this.colors.error, error.message, error.stack);
    } else if (error) {
      console.error(`%c[ERROR] ${message}`, this.colors.error, error);
    } else {
      console.error(`%c[ERROR] ${message}`, this.colors.error);
    }
  }
  
  /**
   * Логирование API запросов
   * @param {string} method - HTTP метод
   * @param {string} url - URL запроса
   * @param {any} data - Данные запроса
   */
  apiRequest(method, url, data) {
    if (!this.shouldLog(this.LOG_LEVELS.DEBUG)) return;
    if (!this.preventDuplicates('api', `${method} ${url}`)) return;
    
    const shortUrl = url.replace(/^\/api\//, '');
    
    if (data) {
      console.log(`%c[API] → ${method} ${shortUrl}`, this.colors.api, data);
    } else {
      console.log(`%c[API] → ${method} ${shortUrl}`, this.colors.api);
    }
  }
  
  /**
   * Логирование ответов API
   * @param {string} method - HTTP метод
   * @param {string} url - URL запроса
   * @param {number} status - Статус ответа
   */
  apiResponse(method, url, status) {
    if (!this.shouldLog(this.LOG_LEVELS.DEBUG)) return;
    if (!this.preventDuplicates('api', `${method} ${url} ${status}`)) return;
    
    const shortUrl = url.replace(/^\/api\//, '');
    const statusColor = status >= 400 ? this.colors.error : this.colors.api;
    
    console.log(`%c[API] ← ${method} ${shortUrl} (${status})`, statusColor);
  }
  
  /**
   * Логирование событий аутентификации
   * @param {string} message - Сообщение
   * @param {any} data - Дополнительные данные
   */
  auth(message, data) {
    if (!this.shouldLog(this.LOG_LEVELS.INFO)) return;
    if (!this.preventDuplicates('auth', message)) return;
    
    if (data) {
      console.log(`%c[AUTH] ${message}`, this.colors.auth, data);
    } else {
      console.log(`%c[AUTH] ${message}`, this.colors.auth);
    }
  }
  
  /**
   * Логирование событий прогресса
   * @param {string} message - Сообщение
   * @param {any} data - Дополнительные данные
   */
  progress(message, data) {
    if (!this.shouldLog(this.LOG_LEVELS.INFO)) return;
    if (!this.preventDuplicates('progress', message)) return;
    
    if (data) {
      console.log(`%c[PROGRESS] ${message}`, this.colors.progress, data);
    } else {
      console.log(`%c[PROGRESS] ${message}`, this.colors.progress);
    }
  }
  
  /**
   * Логирование событий достижений
   * @param {string} message - Сообщение
   * @param {any} data - Дополнительные данные
   */
  achievements(message, data) {
    if (!this.shouldLog(this.LOG_LEVELS.INFO)) return;
    if (!this.preventDuplicates('achievements', message)) return;
    
    if (data) {
      console.log(`%c[ACHIEVEMENTS] ${message}`, this.colors.achievements, data);
    } else {
      console.log(`%c[ACHIEVEMENTS] ${message}`, this.colors.achievements);
    }
  }
}

// Создаем и экспортируем единственный экземпляр сервиса
const logger = new LogService();
export default logger; 