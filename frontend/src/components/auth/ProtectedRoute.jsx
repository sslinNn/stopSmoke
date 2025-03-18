import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectAuthLoading, fetchCurrentUser, selectUser } from '../../store/slices/authSlice';
import { AUTH_STORAGE_KEY } from '../../constants/auth';

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);
  
  useEffect(() => {
    // Проверяем, есть ли данные пользователя в localStorage
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    
    // Запрашиваем данные только если есть authData и пользователь считается аутентифицированным
    // Это предотвращает запросы после выхода из системы
    if (isAuthenticated && authData && (!user || !user.username)) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);
  
  // Если загрузка, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }
  
  // Если не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Если аутентифицирован, показываем защищенный контент
  return children;
}

export default ProtectedRoute; 