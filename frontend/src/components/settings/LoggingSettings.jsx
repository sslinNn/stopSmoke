import { useState, useEffect } from 'react';
import logger from '../../services/LogService';

function LoggingSettings() {
  const [logLevel, setLogLevel] = useState('INFO');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Получаем текущий уровень логирования при монтировании компонента
  useEffect(() => {
    const currentLevel = localStorage.getItem('logLevel');
    if (currentLevel) {
      // Преобразуем числовое значение в строковое название уровня
      const levelNames = Object.keys(logger.LOG_LEVELS);
      const levelName = levelNames.find(name => logger.LOG_LEVELS[name] === parseInt(currentLevel)) || 'INFO';
      setLogLevel(levelName);
    }
  }, []);
  
  // Обработчик изменения уровня логирования
  const handleLogLevelChange = (level) => {
    setLogLevel(level);
    logger.setLogLevel(level);
    showSuccessMessage('Уровень логирования изменен');
  };
  
  // Обработчик очистки кэша логов
  const handleClearLogCache = () => {
    // Сбрасываем кэш логов
    logger.clearCache();
    showSuccessMessage('Кэш логов очищен');
  };
  
  // Показать сообщение об успехе
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Настройки логирования</h2>
        <p className="text-sm mb-4">Управление уровнем детализации логов в консоли разработчика.</p>
        
        {successMessage && (
          <div className="alert alert-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Уровень логирования</span>
          </label>
          <select 
            className="select select-bordered w-full" 
            value={logLevel}
            onChange={(e) => handleLogLevelChange(e.target.value)}
          >
            <option value="DEBUG">DEBUG - Все сообщения (включая отладочные)</option>
            <option value="INFO">INFO - Информационные сообщения и выше</option>
            <option value="WARN">WARN - Только предупреждения и ошибки</option>
            <option value="ERROR">ERROR - Только ошибки</option>
            <option value="NONE">NONE - Отключить все логи</option>
          </select>
          <label className="label">
            <span className="label-text-alt">Изменение уровня логирования влияет на количество сообщений в консоли.</span>
          </label>
        </div>
        
        <div className="mt-4">
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleClearLogCache}
          >
            Очистить кэш логов
          </button>
          <p className="text-xs mt-2 text-base-content/70">
            Очистка кэша логов может помочь, если некоторые сообщения не отображаются из-за дедупликации.
          </p>
        </div>
        
        <div className="divider"></div>
        
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Уровни логирования:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><span className="font-mono">DEBUG</span> - Подробная информация для отладки</li>
            <li><span className="font-mono">INFO</span> - Общая информация о работе приложения</li>
            <li><span className="font-mono">WARN</span> - Предупреждения, которые не нарушают работу</li>
            <li><span className="font-mono">ERROR</span> - Ошибки, которые нарушают работу</li>
            <li><span className="font-mono">NONE</span> - Отключение всех логов</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoggingSettings; 