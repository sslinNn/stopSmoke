import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice';

function FormLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate('/profile');
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="card-body">
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{typeof error === 'string' ? error : 'Ошибка входа. Проверьте данные и попробуйте снова.'}</span>
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
          className="input input-bordered" 
          value={formData.email}
          onChange={handleChange}
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
          placeholder="пароль" 
          className="input input-bordered" 
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label className="label">
          <Link to="/forgot-password" className="label-text-alt link link-hover">Забыли пароль?</Link>
        </label>
      </div>
      
      <div className="form-control mt-6">
        <button 
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`} 
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </div>
      
      <div className="text-center mt-4">
        <p>Нет аккаунта? <Link to="/register" className="link link-primary">Зарегистрироваться</Link></p>
      </div>
    </form>
  );
}

export default FormLogin; 