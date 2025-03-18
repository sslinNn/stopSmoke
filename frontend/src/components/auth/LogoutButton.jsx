import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/slices/authSlice';
import { resetUserData } from '../../store/slices/userSlice';

function LogoutButton({ className = 'btn btn-ghost' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      // Сначала сбрасываем данные пользователя, чтобы компоненты перестали делать запросы
      dispatch(resetUserData());
      
      // Затем выходим из системы
      await dispatch(logoutUser()).unwrap();
      
      // Перенаправление на страницу входа
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };
  
  return (
    <button 
      className={className} 
      onClick={handleLogout}
    >
      Выйти
    </button>
  );
}

export default LogoutButton; 