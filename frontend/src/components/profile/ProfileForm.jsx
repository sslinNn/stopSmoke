import { useState } from 'react';

function ProfileForm({ userData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    username: userData?.username || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/users/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить профиль');
      }

      const data = await response.json();
      onSave(data.user_data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Имя пользователя</span>
        </label>
        <input 
          type="text" 
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Имя пользователя" 
          className="input input-bordered" 
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
          placeholder="Ваше имя" 
          className="input input-bordered" 
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
          placeholder="Ваша фамилия" 
          className="input input-bordered" 
        />
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <button 
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
        >
          Отмена
        </button>
        <button 
          type="submit" 
          className={`btn btn-primary ${isSaving ? 'loading' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm; 