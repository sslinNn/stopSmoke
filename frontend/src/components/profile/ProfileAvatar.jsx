import { useState } from 'react';
import apiService from '../../services/ApiService';
import logger from '../../services/LogService';

function ProfileAvatar({ userData, onAvatarUpdate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      logger.auth('Загрузка аватара');
      const response = await apiService.uploadFile('/api/users/update/avatar', formData);

      if (response.success && response.avatar_data) {
        logger.auth('Аватар успешно загружен');
        onAvatarUpdate(response.avatar_data);
        setSelectedFile(null);
      } else {
        throw new Error('Не удалось загрузить аватар');
      }
    } catch (err) {
      logger.error('Ошибка при загрузке аватара', err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="avatar">
        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          {userData?.avatar_url ? (
            <img 
              src={userData.avatar_url} 
              alt="Аватар пользователя" 
              onError={(e) => {
                logger.error('Ошибка загрузки аватара', e);
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/100x100?text=User';
              }}
            />
          ) : (
            <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full text-xl font-bold">
              {userData?.username ? userData.username.charAt(0).toUpperCase() : 'У'}
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="text-error text-sm">{error}</div>
      )}
      
      <div className="form-control w-full max-w-xs">
        <input 
          type="file" 
          className="file-input file-input-bordered w-full" 
          onChange={handleFileChange}
          accept="image/*"
        />
        <button 
          className={`btn btn-primary btn-sm mt-2 w-full ${isUploading ? 'loading' : ''}`}
          onClick={handleUploadAvatar}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Загрузка...' : 'Обновить аватар'}
        </button>
      </div>
    </div>
  );
}

export default ProfileAvatar; 