/**
 * Компонент для отображения статистики
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок статистики
 * @param {string|number} props.value - Значение статистики
 * @param {React.ReactNode} props.icon - Иконка
 * @param {string} props.description - Описание статистики
 * @param {string} props.className - Дополнительные классы
 * @param {string} props.trend - Тренд (up, down, neutral)
 * @returns {JSX.Element} Компонент статистики
 */
function Stat({
  title,
  value,
  icon,
  description,
  className = '',
  trend = 'neutral',
  ...rest
}) {
  const trendIcons = {
    up: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
      </svg>
    ),
    down: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
      </svg>
    ),
    neutral: null
  };
  
  const statClasses = [
    'stat',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={statClasses} {...rest}>
      {icon && (
        <div className="stat-figure text-primary">
          {icon}
        </div>
      )}
      
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      
      {description && (
        <div className="stat-desc flex items-center">
          {trendIcons[trend]}
          <span className="ml-1">{description}</span>
        </div>
      )}
    </div>
  );
}

export default Stat; 