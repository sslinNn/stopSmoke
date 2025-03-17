import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import Input from '../common/Input';
import logger from '../../services/LogService';

/**
 * Компонент формы регистрации
 * @returns {JSX.Element} Компонент формы регистрации
 */
function RegisterForm() {
  const { register } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку поля при изменении
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Валидация email
    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный формат email';
    }
    
    // Валидация имени пользователя
    if (!formData.username) {
      errors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      errors.username = 'Имя пользователя должно содержать не менее 3 символов';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Имя пользователя может содержать только буквы, цифры и символ подчеркивания';
    }
    
    // Валидация пароля
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать не менее 6 символов';
    }
    
    // Валидация подтверждения пароля
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    logger.auth('Отправка запроса на регистрацию', { email: formData.email, username: formData.username });

    try {
      const result = await register({
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Ошибка при регистрации');
      }
      
      logger.auth('Регистрация выполнена успешно');
      logger.auth('Перенаправление на страницу профиля');
      navigate('/profile');
    } catch (err) {
      logger.error('Ошибка при регистрации', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Регистрация"
      error={error}
      isLoading={isLoading}
      submitText="Зарегистрироваться"
      loadingText="Регистрация..."
      onSubmit={handleSubmit}
      footerText="Уже есть аккаунт?"
      footerLinkText="Войти"
      footerLinkTo="/login"
    >
      <Input 
        label="Email"
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="example@mail.com" 
        required
        error={formErrors.email}
      />
      
      <Input 
        label="Имя пользователя"
        type="text" 
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="username" 
        required
        error={formErrors.username}
        helperText="Используйте только буквы, цифры и символ подчеркивания"
      />
      
      <Input 
        label="Пароль"
        type="password" 
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Введите пароль" 
        required
        error={formErrors.password}
        helperText="Минимум 6 символов"
      />
      
      <Input 
        label="Подтверждение пароля"
        type="password" 
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Повторите пароль" 
        required
        error={formErrors.confirmPassword}
      />
    </AuthForm>
  );
}

export default RegisterForm; 