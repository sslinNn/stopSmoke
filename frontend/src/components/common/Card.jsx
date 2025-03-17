/**
 * Компонент карточки с различными вариантами отображения
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок карточки
 * @param {React.ReactNode} props.children - Содержимое карточки
 * @param {React.ReactNode} props.footer - Футер карточки
 * @param {string} props.className - Дополнительные классы
 * @param {boolean} props.compact - Компактный вид
 * @param {boolean} props.bordered - Отображать ли границу
 * @param {boolean} props.hoverable - Добавлять ли эффект при наведении
 * @returns {JSX.Element} Компонент карточки
 */
function Card({
  title,
  children,
  footer,
  className = '',
  compact = false,
  bordered = true,
  hoverable = false,
  ...rest
}) {
  const cardClasses = [
    'card',
    'bg-base-100',
    bordered ? 'shadow-xl' : '',
    compact ? 'card-compact' : '',
    hoverable ? 'hover:shadow-2xl transition-shadow duration-300' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cardClasses} {...rest}>
      {title && (
        <div className="card-title p-4 pb-0">
          {title}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-actions justify-end p-4 pt-0">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card; 