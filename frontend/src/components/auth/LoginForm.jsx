import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import Input from '../common/Input';
import logger from '../../services/LogService';

/**
 * Компонент формы входа
 * @returns {JSX.Element} Компонент формы входа
 */
function LoginForm() {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    
    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный формат email';
    }
    
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать не менее 6 символов';
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
    logger.auth('Отправка формы входа', { email: formData.email });

    try {
      const result = await login(formData);
      
      if (!result.success) {
        throw new Error(result.error || 'Ошибка при входе');
      }
      
      logger.auth('Вход выполнен успешно, перенаправление на профиль');
      navigate('/profile');
    } catch (err) {
      logger.error('Ошибка при входе', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Вход в аккаунт"
      error={error}
      isLoading={isLoading}
      submitText="Войти"
      loadingText="Вход..."
      onSubmit={handleSubmit}
      footerText="Еще нет аккаунта?"
      footerLinkText="Зарегистрироваться"
      footerLinkTo="/register"
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
        label="Пароль"
        type="password" 
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Введите пароль" 
        required
        error={formErrors.password}
        helperText={
          <a href="#" className="link link-hover">Забыли пароль?</a>
        }
      />
    </AuthForm>
  );
}

export default LoginForm; 