import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import FormLogin from '../components/auth/FormLogin';

function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Если пользователь уже авторизован, перенаправляем на главную страницу
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Вход в систему</h1>
          <p className="py-6">Войдите в свой аккаунт, чтобы отслеживать прогресс и получать поддержку.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <FormLogin />
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 