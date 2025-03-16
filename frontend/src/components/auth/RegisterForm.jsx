import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_repeat: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log('🔄 Отправка запроса на регистрацию...');

    // Проверка совпадения паролей
    if (formData.password !== formData.password_repeat) {
      console.error('❌ Пароли не совпадают');
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log(`📥 Ответ от /api/auth/register: ${response.status}`);
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Ошибка при регистрации:', data);
        throw new Error(data.detail || 'Ошибка при регистрации');
      }

      console.log('✅ Регистрация выполнена успешно');
      
      // Успешная регистрация, перенаправляем на страницу входа
      console.log('🔄 Перенаправление на страницу входа...');
      navigate('/login');
    } catch (err) {
      console.error('❌ Ошибка при регистрации:', err);
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
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@mail.com" 
          className="input input-bordered" 
          required 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Имя пользователя</span>
        </label>
        <input 
          type="text" 
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Как к вам обращаться" 
          className="input input-bordered" 
          required 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Пароль</span>
        </label>
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Минимум 6 символов" 
          className="input input-bordered" 
          required 
          minLength={6}
        />
        <p className="text-xs text-gray-500 mt-1">
          Пароль должен содержать минимум 6 символов и не содержать кириллицу
        </p>
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Повторите пароль</span>
        </label>
        <input 
          type="password" 
          name="password_repeat"
          value={formData.password_repeat}
          onChange={handleChange}
          placeholder="Повторите пароль" 
          className="input input-bordered" 
          required 
          minLength={6}
        />
      </div>
    </AuthForm>
  );
}

export default RegisterForm; 