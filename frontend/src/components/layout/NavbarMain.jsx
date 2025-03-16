import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

function NavbarMain() {
  const { user, isAuthenticated } = useUser();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Проверка активного маршрута
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <label 
            tabIndex={0} 
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/" className={isActive('/')}>Главная</Link></li>
              {isAuthenticated ? (
                <>
                  <li><Link to="/progress" className={isActive('/progress')}>Мой прогресс</Link></li>
                  <li><Link to="/achievements" className={isActive('/achievements')}>Достижения</Link></li>
                  <li><Link to="/resources" className={isActive('/resources')}>Полезные ресурсы</Link></li>
                </>
              ) : (
                <li><Link to="/resources" className={isActive('/resources')}>Полезные ресурсы</Link></li>
              )}
            </ul>
          )}
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <span className="text-primary">Party</span>Finder
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/" className={isActive('/')}>Главная</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/progress" className={isActive('/progress')}>Мой прогресс</Link></li>
              <li><Link to="/achievements" className={isActive('/achievements')}>Достижения</Link></li>
              <li><Link to="/resources" className={isActive('/resources')}>Полезные ресурсы</Link></li>
            </>
          ) : (
            <li><Link to="/resources" className={isActive('/resources')}>Полезные ресурсы</Link></li>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.username} />
                ) : (
                  <div className="bg-primary text-primary-content flex items-center justify-center h-full text-xl font-bold">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link to="/profile" className="justify-between">
                  Профиль
                  <span className="badge">{user.username}</span>
                </Link>
              </li>
              <li><Link to="/settings">Настройки</Link></li>
              <li><Link to="/logout">Выйти</Link></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-sm btn-primary">Войти</Link>
            <Link to="/register" className="btn btn-sm btn-outline">Регистрация</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavbarMain; 