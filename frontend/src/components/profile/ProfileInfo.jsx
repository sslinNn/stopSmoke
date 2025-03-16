function ProfileInfo({ userData, onEdit }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="card-title">Информация профиля</h2>
        <button 
          className="btn btn-ghost"
          onClick={onEdit}
        >
          Редактировать
        </button>
      </div>
      
      <div className="mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm opacity-70">Имя пользователя</h3>
            <p className="text-lg">{userData?.username || 'Не указано'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm opacity-70">Email</h3>
            <p className="text-lg">{userData?.email || 'Не указано'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm opacity-70">Имя</h3>
            <p className="text-lg">{userData?.first_name || 'Не указано'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm opacity-70">Фамилия</h3>
            <p className="text-lg">{userData?.last_name || 'Не указано'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo; 