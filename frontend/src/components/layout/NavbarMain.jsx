import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import logger from '../../services/LogService';
import { useState } from 'react';

/**
 * Компонент главной навигационной панели
 * @returns {JSX.Element} Компонент навигационной панели
 */
function NavbarMain() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/progress">Прогресс</Link></li>
            <li><Link to="/community">Сообщество</Link></li>
            <li><Link to="/resources">Ресурсы</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">PartyFinder</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/progress">Прогресс</Link></li>
          <li><Link to="/community">Сообщество</Link></li>
          <li><Link to="/resources">Ресурсы</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <Avatar 
                src={user.avatar_url} 
                alt={user.username || 'Пользователь'} 
                fallbackText={user.username ? user.username.charAt(0).toUpperCase() : 'У'}
                size="sm"
                bordered
              />
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/profile">Профиль</Link></li>
              <li><Link to="/achievements">Достижения</Link></li>
              <li><button onClick={handleLogout}>Выйти</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Регистрация</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavbarMain; 