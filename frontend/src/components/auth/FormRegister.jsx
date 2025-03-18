import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice';

function FormRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_repeat: '',
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный email';
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (formData.password !== formData.password_repeat) {
      errors.password_repeat = 'Пароли не совпадают';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку валидации при изменении поля
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(registerUser(formData)).unwrap();
      navigate('/profile');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="card-body">
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{typeof error === 'string' ? error : 'Ошибка регистрации. Проверьте данные и попробуйте снова.'}</span>
        </div>
      )}
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="email" 
          className={`input input-bordered ${validationErrors.email ? 'input-error' : ''}`}
          value={formData.email}
          onChange={handleChange}
          required
        />
        {validationErrors.email && (
          <label className="label">
            <span className="label-text-alt text-error">{validationErrors.email}</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Пароль</span>
        </label>
        <input
          type="password"
          name="password"
          placeholder="пароль" 
          className={`input input-bordered ${validationErrors.password ? 'input-error' : ''}`}
          value={formData.password}
          onChange={handleChange}
          required
        />
        {validationErrors.password && (
          <label className="label">
            <span className="label-text-alt text-error">{validationErrors.password}</span>
          </label>
        )}
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Подтверждение пароля</span>
        </label>
        <input
          type="password"
          name="password_repeat"
          placeholder="подтверждение пароля" 
          className={`input input-bordered ${validationErrors.password_repeat ? 'input-error' : ''}`}
          value={formData.password_repeat}
          onChange={handleChange}
          required
        />
        {validationErrors.password_repeat && (
          <label className="label">
            <span className="label-text-alt text-error">{validationErrors.password_repeat}</span>
          </label>
        )}
      </div>
      
      <div className="form-control mt-6">
        <button 
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`} 
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </div>
      
      <div className="text-center mt-4">
        <p>Уже есть аккаунт? <Link to="/login" className="link link-primary">Войти</Link></p>
      </div>
    </form>
  );
}

export default FormRegister; 