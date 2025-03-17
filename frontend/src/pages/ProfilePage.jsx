import React from 'react';

function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка - аватар и основная информация */}
        <div className="md:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src="https://placehold.co/100x100?text=User" alt="Аватар пользователя" />
                </div>
              </div>
              
              <h2 className="card-title mt-4">Имя пользователя</h2>
              <p>user@example.com</p>
              
              <div className="mt-4">
                <button className="btn btn-primary btn-sm">
                  Изменить аватар
                </button>
              </div>
              
              <div className="divider"></div>
              
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Дней без курения</div>
                  <div className="stat-value">0</div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn btn-outline btn-error">
                  Выйти из системы
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Правая колонка - форма профиля */}
        <div className="md:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Профиль пользователя</h2>
              
              <form>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Имя пользователя</span>
                  </label>
                  <input 
                    type="text" 
                    name="username"
                    className="input input-bordered w-full" 
                    placeholder="Имя пользователя"
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
                    disabled
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
                  />
                </div>
                
                <div className="card-actions justify-end mt-6">
                  <button 
                    type="button"
                    className="btn btn-primary"
                  >
                    Сохранить изменения
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