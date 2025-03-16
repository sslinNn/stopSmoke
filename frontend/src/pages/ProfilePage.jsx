import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import logger from '../services/LogService';

function ProfilePage() {
  const { user, updateUserProfile, updateUserAvatar, logout, isLoading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Состояние формы
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Инициализация формы данными пользователя
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      
      if (user.avatar_url) {
        setAvatarPreview(user.avatar_url);
      }
    }
  }, [user]);

  // Обработчик изменения аватара
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Проверка типа файла
    if (!file.type.match('image.*')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }
    
    // Проверка размера файла (не более 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5 МБ');
      return;
    }
    
    setAvatar(file);
    
    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    logger.debug('Выбран новый аватар', { fileName: file.name, fileSize: file.size });
  };

  // Обработчик отправки формы профиля
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      logger.debug('Отправка данных профиля', { username, email, bio });
      
      // Обновляем профиль
      const result = await updateUserProfile({
        username,
        email,
        bio
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Не удалось обновить профиль');
      }
      
      // Если выбран новый аватар, загружаем его
      if (avatar) {
        logger.debug('Загрузка нового аватара');
        
        const formData = new FormData();
        formData.append('avatar', avatar);
        
        const avatarResult = await updateUserAvatar(formData);
        
        if (!avatarResult.success) {
          throw new Error(avatarResult.error || 'Не удалось обновить аватар');
        }
      }
      
      setSuccess('Профиль успешно обновлен');
      logger.info('Профиль пользователя обновлен успешно');
    } catch (err) {
      logger.error('Ошибка при обновлении профиля', err);
      setError(err.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик выхода из системы
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      logger.auth('Выполняется выход из системы');
      
      const result = await logout();
      
      if (!result.success) {
        throw new Error(result.error || 'Не удалось выйти из системы');
      }
    } catch (err) {
      logger.error('Ошибка при выходе из системы', err);
      setError(err.message || 'Произошла ошибка при выходе из системы');
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем загрузку, если пользователь загружается
  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Если пользователь не авторизован, показываем сообщение
  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-warning">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Для доступа к профилю необходимо авторизоваться</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ваш профиль</h1>
      
      {error && (
        <div className="alert alert-error mb-4">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        </div>
      )}
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleProfileSubmit}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Аватар</span>
                  </label>
                  <div className="flex flex-col items-center">
                    <div className="avatar mb-4">
                      <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img 
                          src={avatarPreview || '/images/default-avatar.png'} 
                          alt="Аватар пользователя" 
                        />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      className="file-input file-input-bordered file-input-primary w-full max-w-xs" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <label className="label">
                      <span className="label-text-alt">Максимальный размер: 5 МБ</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Имя пользователя</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    className="input input-bordered" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">О себе</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered h-24" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Расскажите о себе и своем пути к здоровью"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button 
                type="button" 
                className="btn btn-outline btn-error"
                onClick={handleLogout}
                disabled={isLoading}
              >
                Выйти из системы
              </button>
              
              <button 
                type="submit" 
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                Сохранить изменения
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 