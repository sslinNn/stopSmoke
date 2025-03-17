/**
 * Компонент кнопки с различными вариантами отображения
 * @param {Object} props - Свойства компонента
 * @param {string} props.variant - Вариант кнопки (primary, secondary, accent, ghost, link, outline)
 * @param {string} props.size - Размер кнопки (xs, sm, md, lg)
 * @param {boolean} props.isLoading - Показывать ли индикатор загрузки
 * @param {boolean} props.isDisabled - Отключена ли кнопка
 * @param {string} props.loadingText - Текст при загрузке
 * @param {function} props.onClick - Обработчик клика
 * @param {string} props.type - Тип кнопки (button, submit, reset)
 * @param {string} props.className - Дополнительные классы
 * @param {React.ReactNode} props.children - Содержимое кнопки
 * @returns {JSX.Element} Компонент кнопки
 */
function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  loadingText,
  onClick,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const baseClass = 'btn';
  const variantClass = variant ? `btn-${variant}` : '';
  const sizeClass = size ? `btn-${size}` : '';
  const loadingClass = isLoading ? 'loading' : '';
  
  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      {...rest}
    >
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}

export default Button; 