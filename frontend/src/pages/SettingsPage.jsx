import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LoggingSettings from '../components/settings/LoggingSettings';

function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState('general');

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Настройки</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Настройки</h1>
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Пожалуйста, войдите в систему, чтобы получить доступ к настройкам.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Настройки</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Боковое меню */}
        <div className="md:w-64">
          <ul className="menu bg-base-200 rounded-box">
            <li className="menu-title">Настройки</li>
            <li>
              <button 
                className={activeTab === 'general' ? 'active' : ''} 
                onClick={() => setActiveTab('general')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Общие
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'profile' ? 'active' : ''} 
                onClick={() => setActiveTab('profile')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Профиль
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'notifications' ? 'active' : ''} 
                onClick={() => setActiveTab('notifications')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Уведомления
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'appearance' ? 'active' : ''} 
                onClick={() => setActiveTab('appearance')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Внешний вид
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'logging' ? 'active' : ''} 
                onClick={() => setActiveTab('logging')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Логирование
              </button>
            </li>
          </ul>
        </div>
        
        {/* Содержимое вкладок */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Общие настройки</h2>
                <p className="text-sm mb-4">Основные настройки приложения.</p>
                
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Показывать приветствие при входе</span> 
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </label>
                </div>
                
                <div className="form-control mt-4">
                  <label className="label cursor-pointer">
                    <span className="label-text">Автоматически обновлять данные</span> 
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </label>
                </div>
                
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Часовой пояс</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option>Москва (GMT+3)</option>
                    <option>Калининград (GMT+2)</option>
                    <option>Екатеринбург (GMT+5)</option>
                    <option>Новосибирск (GMT+7)</option>
                    <option>Владивосток (GMT+10)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Настройки профиля</h2>
                <p className="text-sm mb-4">Управление личными данными и настройками профиля.</p>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Имя пользователя</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    defaultValue={user.username || ''} 
                  />
                </div>
                
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    className="input input-bordered" 
                    defaultValue={user.email || ''} 
                    disabled 
                  />
                  <label className="label">
                    <span className="label-text-alt">Email нельзя изменить</span>
                  </label>
                </div>
                
                <div className="mt-6">
                  <button className="btn btn-primary">Сохранить изменения</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Настройки уведомлений</h2>
                <p className="text-sm mb-4">Управление уведомлениями и напоминаниями.</p>
                
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Email-уведомления</span> 
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </label>
                </div>
                
                <div className="form-control mt-4">
                  <label className="label cursor-pointer">
                    <span className="label-text">Уведомления о достижениях</span> 
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </label>
                </div>
                
                <div className="form-control mt-4">
                  <label className="label cursor-pointer">
                    <span className="label-text">Ежедневные напоминания</span> 
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
                
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Время ежедневных напоминаний</span>
                  </label>
                  <input type="time" className="input input-bordered" defaultValue="09:00" />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Настройки внешнего вида</h2>
                <p className="text-sm mb-4">Настройка темы и визуальных элементов приложения.</p>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Тема</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option>Светлая</option>
                    <option>Темная</option>
                    <option>Системная</option>
                  </select>
                </div>
                
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Основной цвет</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option>Синий</option>
                    <option>Зеленый</option>
                    <option>Красный</option>
                    <option>Фиолетовый</option>
                    <option>Оранжевый</option>
                  </select>
                </div>
                
                <div className="form-control mt-4">
                  <label className="label cursor-pointer">
                    <span className="label-text">Анимации</span> 
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'logging' && <LoggingSettings />}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage; 