import {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCurrentUser, selectIsAuthenticated, selectUser} from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ResourcesPage from './pages/ResourcesPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AUTH_STORAGE_KEY } from './constants/auth';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Загружаем данные пользователя при первом рендере, если есть токен
  useEffect(() => {
    // Проверяем, есть ли данные пользователя в localStorage
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    
    // Запрашиваем данные только если пользователь аутентифицирован и есть данные в localStorage,
    // но нет полных данных пользователя в Redux
    if (isAuthenticated && authData && (!user || !user.username)) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  return (<Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<HomePage/>}/>
        <Route path="login" element={<LoginPage/>}/>
        <Route path="register" element={<RegisterPage/>}/>
        <Route path="profile" element={<ProtectedRoute>
          <ProfilePage/>
        </ProtectedRoute>}/>
        <Route path="resources" element={<ResourcesPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Routes>);
}

export default App; 