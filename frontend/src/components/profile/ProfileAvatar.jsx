import { useState } from 'react';

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
      const response = await fetch('/api/users/update/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить аватар');
      }

      const data = await response.json();
      onAvatarUpdate(data.avatar_url);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={userData?.avatar_url || '/placeholder-avatar.jpg'} alt="Аватар пользователя" />
          </div>
        </div>
        
        <h2 className="card-title mt-4">{userData?.username || 'Пользователь'}</h2>
        <p>{userData?.email}</p>
        
        {error && (
          <div className="alert alert-error mt-2">
            <span>{error}</span>
          </div>
        )}
        
        <div className="mt-4 w-full">
          <input 
            type="file" 
            className="file-input file-input-bordered w-full max-w-xs" 
            onChange={handleFileChange}
            accept="image/*"
          />
          <button 
            className={`btn btn-primary mt-2 w-full ${isUploading ? 'loading' : ''}`}
            onClick={handleUploadAvatar}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Загрузка...' : 'Обновить аватар'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileAvatar; 