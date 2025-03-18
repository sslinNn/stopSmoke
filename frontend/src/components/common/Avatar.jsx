import { useState } from 'react';
/**
 * Компонент аватара пользователя
 * @param {Object} props - Свойства компонента
 * @param {string} props.src - URL изображения аватара
 * @param {string} props.alt - Альтернативный текст
 * @param {string} props.fallbackText - Текст для отображения, если изображение не загрузилось
 * @param {string} props.size - Размер аватара (xs, sm, md, lg, xl)
 * @param {string} props.shape - Форма аватара (circle, square, rounded)
 * @param {string} props.className - Дополнительные классы
 * @param {boolean} props.bordered - Отображать ли границу
 * @param {string} props.borderColor - Цвет границы
 * @returns {JSX.Element} Компонент аватара
 */
function Avatar({
  src,
  alt = 'Аватар пользователя',
  fallbackText = '',
  size = 'md',
  shape = 'circle',
  className = '',
  bordered = false,
  borderColor = 'primary',
  ...rest
}) {
  const [hasError, setHasError] = useState(false);
  
  // Определяем размеры
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };
  
  // Определяем форму
  const shapeClasses = {
    circle: 'rounded-full',
    square: '',
    rounded: 'rounded-lg'
  };
  
  // Определяем границу
  const borderClass = bordered ? `ring ring-${borderColor} ring-offset-base-100 ring-offset-2` : '';
  
  // Собираем классы
  const avatarClasses = [
    sizeClasses[size] || sizeClasses.md,
    shapeClasses[shape] || shapeClasses.circle,
    borderClass,
    className
  ].filter(Boolean).join(' ');
  
  // Если есть изображение и нет ошибки, показываем его
  if (src && !hasError) {
    return (
      <div className={avatarClasses}>
        <img 
          src={src} 
          alt={alt} 
          onError={handleError}
          onLoad={handleLoad}
          className="w-full h-full object-cover"
          {...rest}
        />
      </div>
    );
  }
  
  // Иначе показываем заглушку с текстом
  const text = fallbackText || (alt ? alt.charAt(0).toUpperCase() : 'U');
  
  return (
    <div className={`${avatarClasses} bg-primary text-primary-content flex items-center justify-center`}>
      <span className="text-xl font-bold">{text}</span>
    </div>
  );
}

export default Avatar; 