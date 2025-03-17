import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import QuitDateForm from '../components/progress/QuitDateForm';
import ProgressStats from '../components/progress/ProgressStats';
import ProgressChart from '../components/progress/ProgressChart';
import CravingLogger from '../components/progress/CravingLogger';
import AchievementsList from '../components/achievements/AchievementsList';

function ProgressPage() {
  const { 
    user, 
    isAuthenticated, 
    isLoading: isUserLoading, 
    progressData, 
    achievements,
    fetchProgressData, 
    fetchAchievements 
  } = useUser();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentAchievements, setRecentAchievements] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Загружаем данные о прогрессе и достижениях, если их еще нет
        const progressPromise = !progressData ? fetchProgressData() : Promise.resolve(progressData);
        const achievementsPromise = !achievements ? fetchAchievements() : Promise.resolve(achievements);
        
        await Promise.all([progressPromise, achievementsPromise]);
        
        // Получаем последние 3 достижения для отображения
        if (achievements && achievements.length > 0) {
          const sorted = [...achievements]
            .filter(a => a.unlocked)
            .sort((a, b) => new Date(b.unlocked_at) - new Date(a.unlocked_at))
            .slice(0, 3);
          
          setRecentAchievements(sorted);
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные о прогрессе. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [isAuthenticated, fetchProgressData, fetchAchievements, progressData, achievements]);

  if (isUserLoading || isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Мой прогресс</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Мой прогресс</h1>
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Пожалуйста, войдите в систему, чтобы увидеть свой прогресс.</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Мой прогресс</h1>
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Если у пользователя нет даты отказа от курения, показываем форму
  if (!user.quit_date) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Мой прогресс</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Начните свой путь к здоровью</h2>
            <p className="mb-4">Чтобы отслеживать прогресс, укажите дату отказа от курения и некоторую дополнительную информацию.</p>
            <QuitDateForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Мой прогресс</h1>
      
      {/* Статистика прогресса */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Ваша статистика</h2>
          <ProgressStats progressData={progressData} />
        </div>
      </div>
      
      {/* График улучшения здоровья */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Улучшения здоровья</h2>
          <ProgressChart progressData={progressData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Логгер тяги */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <CravingLogger />
          </div>
        </div>
        
        {/* Последние достижения */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Последние достижения</h2>
            <AchievementsList 
              achievements={recentAchievements} 
              isLoading={isLoading} 
              showViewAll={true} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage; 