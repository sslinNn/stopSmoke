import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {selectUser, selectIsAuthenticated, selectAuthLoading} from '../../store/slices/authSlice';
import {logoutUser} from '../../store/slices/authSlice';
import {resetUserData} from '../../store/slices/userSlice';
import {useNavigate} from 'react-router-dom';
import {AVATAR} from "../../constants/auth.js";


/**
 * Компонент главной навигационной панели
 * @returns {JSX.Element} Компонент навигационной панели
 */
function NavbarMain() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  const handleLogout = async () => {
    try {
      // Сначала сбрасываем данные пользователя
      dispatch(resetUserData());
      
      // Затем выходим из системы
      await dispatch(logoutUser()).unwrap();
      
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Функция для получения инициалов пользователя
  const getUserInitials = () => {
    if (!user || !user.username) return 'У';
    return user.username.charAt(0).toUpperCase();
  };


  return (<div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"/>
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/progress">Прогресс</Link></li>
            <li><Link to="/community">Сообщество</Link></li>
            <li><Link to="/resources">Ресурсы</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">БросайКурить</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/progress">Прогресс</Link></li>
          <li><Link to="/community">Сообщество</Link></li>
          <li><Link to="/resources">Ресурсы</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        {isLoading ? (<span className="loading loading-spinner loading-sm"></span>) : isAuthenticated && user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {user.avatar_url ? (<img
                    src={AVATAR(user)}
                    alt={user.username || 'Пользователь'}
                  />) : (<div className="bg-primary text-primary-content flex items-center justify-center h-full">
                    {getUserInitials()}
                  </div>)}
              </div>
            </div>
            <ul tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link to="/profile" className="justify-between">
                  Профиль
                  <span className="badge">{user.username}</span>
                </Link>
              </li>
              <li><Link to="/settings">Настройки</Link></li>
              <li>
                <button onClick={handleLogout}>Выйти</button>
              </li>
            </ul>
          </div>) : (<div className="flex gap-2">
            <Link to="/login">
              <button className="btn btn-ghost">Войти</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-primary">Регистрация</button>
            </Link>
          </div>)}
      </div>
    </div>);
}

export default NavbarMain; 