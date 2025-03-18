import { useState, useEffect } from 'react';


function ProfileForm({ userData }) {
  const { updateUserProfile } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Заполняем форму данными пользователя при загрузке
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || ''
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    logger.auth('Отправка запроса на обновление профиля', formData);
    
    try {
      const result = await updateUserProfile(formData);
      
      if (result.success) {
        logger.auth('Профиль успешно обновлен');
        setSuccess('Профиль успешно обновлен');
        setIsEditing(false);
      } else {
        logger.error('Ошибка при обновлении профиля', result.error);
        setError(result.error || 'Не удалось обновить профиль');
      }
    } catch (err) {
      logger.error('Ошибка при обновлении профиля', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Профиль пользователя</h2>
        
        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Имя пользователя</span>
            </label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered" 
              disabled={!isEditing || isSubmitting}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered" 
              disabled={!isEditing || isSubmitting}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Имя</span>
            </label>
            <input 
              type="text" 
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="input input-bordered" 
              disabled={!isEditing || isSubmitting}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Фамилия</span>
            </label>
            <input 
              type="text" 
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="input input-bordered" 
              disabled={!isEditing || isSubmitting}
            />
          </div>
          
          <div className="form-control mt-6">
            {isEditing ? (
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className={`btn btn-primary flex-1 ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Отмена
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setIsEditing(true)}
              >
                Редактировать профиль
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileForm; 