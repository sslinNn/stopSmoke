import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAvatar, selectUserLoading } from '../../store/slices/userSlice';
import logger from '../../utils/logger';
import { AVATAR } from '../../constants/auth';

function ProfileAvatar({ userData }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectUserLoading);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      logger.auth('Загрузка аватара');
      await dispatch(updateUserAvatar(formData)).unwrap();
      logger.auth('Аватар успешно загружен');
      setSelectedFile(null);
    } catch (err) {
      logger.error('Ошибка при загрузке аватара', err);
      setError(err.message || 'Произошла ошибка при загрузке аватара');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="avatar">
        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          {userData?.avatar_url ? (
            <img 
              src={AVATAR(userData)} 
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
          className={`btn btn-primary btn-sm mt-2 w-full ${isLoading ? 'loading' : ''}`}
          onClick={handleUploadAvatar}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Обновить аватар'}
        </button>
      </div>
    </div>
  );
}

export default ProfileAvatar; 