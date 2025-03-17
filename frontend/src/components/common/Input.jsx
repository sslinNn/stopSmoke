/**
 * Компонент поля ввода
 * @param {Object} props - Свойства компонента
 * @param {string} props.label - Метка поля
 * @param {string} props.name - Имя поля
 * @param {string} props.type - Тип поля (text, email, password, etc.)
 * @param {string} props.value - Значение поля
 * @param {function} props.onChange - Обработчик изменения значения
 * @param {string} props.placeholder - Плейсхолдер
 * @param {boolean} props.required - Обязательно ли поле
 * @param {boolean} props.disabled - Отключено ли поле
 * @param {string} props.error - Сообщение об ошибке
 * @param {string} props.helperText - Вспомогательный текст
 * @param {string} props.className - Дополнительные классы
 * @returns {JSX.Element} Компонент поля ввода
 */
function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  ...rest
}) {
  const inputClasses = [
    'input',
    'input-bordered',
    'w-full',
    error ? 'input-error' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label" htmlFor={name}>
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...rest}
      />
      
      <label className="label">
        {error && <span className="label-text-alt text-error">{error}</span>}
        {helperText && !error && <span className="label-text-alt">{helperText}</span>}
      </label>
    </div>
  );
}

export default Input; 