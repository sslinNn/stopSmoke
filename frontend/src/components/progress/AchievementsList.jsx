import { Link } from 'react-router-dom';

function AchievementsList({ achievements }) {
  // Если достижений нет или они не загружены
  if (!achievements || achievements.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Твои достижения</h2>
          <p>Начни свой путь к отказу от курения, чтобы разблокировать достижения!</p>
          <div className="card-actions justify-end mt-4">
            <Link to="/achievements" className="btn btn-primary">Все достижения</Link>
          </div>
        </div>
      </div>
    );
  }

  // Фильтруем только разблокированные достижения
  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);
  
  // Берем последние 3 разблокированных достижения
  const recentAchievements = unlockedAchievements.slice(0, 3);
  
  // Находим следующее достижение, которое можно разблокировать
  const nextAchievement = achievements.find(achievement => 
    !achievement.unlocked && achievement.progress && achievement.progress.current > 0
  );

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Твои достижения</h2>
        <p>Ты разблокировал {unlockedAchievements.length} из {achievements.length} достижений</p>
        
        {recentAchievements.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Последние достижения:</h3>
            <div className="space-y-3">
              {recentAchievements.map(achievement => (
                <div key={achievement.id} className="flex items-center gap-3 bg-primary bg-opacity-10 p-3 rounded-lg">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-content">
                      <span className="text-xl">{achievement.icon || '🏆'}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">{achievement.title}</h4>
                    <p className="text-sm">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="alert alert-info mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>У тебя пока нет разблокированных достижений. Продолжай свой путь!</span>
          </div>
        )}
        
        {nextAchievement && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Следующее достижение:</h3>
            <div className="bg-base-200 p-3 rounded-lg">
              <h4 className="font-bold">{nextAchievement.title}</h4>
              <p className="text-sm">{nextAchievement.description}</p>
              {nextAchievement.progress && (
                <progress 
                  className="progress progress-primary w-full mt-2" 
                  value={nextAchievement.progress.current} 
                  max={nextAchievement.progress.target}
                ></progress>
              )}
              <p className="text-xs text-right mt-1">
                {nextAchievement.progress.current} / {nextAchievement.progress.target}
              </p>
            </div>
          </div>
        )}
        
        <div className="card-actions justify-end mt-4">
          <Link to="/achievements" className="btn btn-primary">Все достижения</Link>
        </div>
      </div>
    </div>
  );
}

export default AchievementsList; 