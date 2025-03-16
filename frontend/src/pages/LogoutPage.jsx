import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

function LogoutPage() {
  const { logout, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function performLogout() {
      if (!isAuthenticated) {
        // Если пользователь не авторизован, перенаправляем на главную
        navigate('/');
        return;
      }
      
      // Выполняем выход из системы
      const result = await logout();
      
      // Перенаправляем на главную страницу
      navigate('/', { 
        state: { 
          message: result.success 
            ? 'Вы успешно вышли из системы' 
            : 'Произошла ошибка при выходе из системы' 
        } 
      });
    }
    
    performLogout();
  }, [logout, navigate, isAuthenticated]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-6">Выход из системы</h1>
      <LoadingSpinner text="Выполняется выход из системы..." />
    </div>
  );
}

export default LogoutPage; 