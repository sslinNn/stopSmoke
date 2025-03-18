import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectAuthLoading, fetchCurrentUser } from '../store/slices/authSlice';
import { updateUserProfile, selectUserLoading, selectUserError, selectUserSuccess, clearUserMessages } from '../store/slices/userSlice';
import LogoutButton from '../components/auth/LogoutButton';
import ProfileForm from "../components/profile/ProfileForm.jsx";
import ProfileAvatar from '../components/profile/ProfileAvatar';

function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthLoading = useSelector(selectAuthLoading);
  const isUserLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccess);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  
  // Заполняем форму данными пользователя при загрузке
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [user]);
  
  // Очищаем сообщения об успехе/ошибке через 5 секунд
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearUserMessages());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      // Обновляем данные пользователя после успешного обновления профиля
      dispatch(fetchCurrentUser());
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };
  
  const isLoading = isAuthLoading || isUserLoading;
  
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка - аватар и основная информация */}
        <div className="md:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <ProfileAvatar 
                userData={user} 
              />
              
              <h2 className="card-title mt-4">{user?.username || 'Пользователь'}</h2>
              <p>{user?.email || 'email@example.com'}</p>
              
              <div className="divider"></div>

              <div className="mt-6">
                <LogoutButton className="btn btn-outline btn-error" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Правая колонка - форма профиля */}
        <div className="md:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Профиль пользователя</h2>
              
              {error && (
                <div className="alert alert-error mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{typeof error === 'string' ? error : 'Ошибка обновления профиля'}</span>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{success}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Имя пользователя</span>
                  </label>
                  <input 
                    type="text" 
                    name="username"
                    className="input input-bordered w-full" 
                    placeholder="Имя пользователя"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    className="input input-bordered w-full" 
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className="label-text">Имя</span>
                  </label>
                  <input 
                    type="text" 
                    name="first_name"
                    className="input input-bordered w-full" 
                    placeholder="Имя"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className="label-text">Фамилия</span>
                  </label>
                  <input 
                    type="text" 
                    name="last_name"
                    className="input input-bordered w-full" 
                    placeholder="Фамилия"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="card-actions justify-end mt-6">
                  <button 
                    type="submit"
                    className={`btn btn-primary ${isUserLoading ? 'loading' : ''}`}
                    disabled={isUserLoading}
                  >
                    {isUserLoading ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 