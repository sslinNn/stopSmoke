/**
 * Компонент для группировки статистики
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы (компоненты Stat)
 * @param {string} props.className - Дополнительные классы
 * @param {boolean} props.horizontal - Горизонтальное расположение
 * @param {boolean} props.bordered - Отображать ли границу
 * @param {boolean} props.shadow - Отображать ли тень
 * @returns {JSX.Element} Компонент группы статистики
 */
function StatGroup({
  children,
  className = '',
  horizontal = true,
  bordered = true,
  shadow = true,
  ...rest
}) {
  const statGroupClasses = [
    'stats',
    horizontal ? 'stats-horizontal' : 'stats-vertical',
    bordered ? 'border border-base-300' : '',
    shadow ? 'shadow' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={statGroupClasses} {...rest}>
      {children}
    </div>
  );
}

export default StatGroup; 