import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import { useUser } from '../../contexts/UserContext';

function LoginForm() {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    console.log('🔄 Отправка запроса на вход в систему...');

    try {
      const result = await login(formData);
      
      if (!result.success) {
        throw new Error(result.error || 'Ошибка при входе');
      }
      
      console.log('✅ Вход выполнен успешно');
      console.log('🔄 Перенаправление на страницу профиля...');
      navigate('/profile');
    } catch (err) {
      console.error('❌ Ошибка при входе:', err);
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
          <span className="label-text">Пароль</span>
        </label>
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите пароль" 
          className="input input-bordered" 
          required 
        />
        <label className="label">
          <a href="#" className="label-text-alt link link-hover">Забыли пароль?</a>
        </label>
      </div>
    </AuthForm>
  );
}

export default LoginForm; 