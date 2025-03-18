import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectAuthLoading } from '../store/slices/authSlice';
import { 
  fetchProgressData, 
  selectProgressData, 
  selectProgressLoading, 
  selectProgressError 
} from '../store/slices/progressSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import QuitDateForm from '../components/progress/QuitDateForm';
import ProgressStats from '../components/progress/ProgressStats';
import ProgressChart from '../components/progress/ProgressChart';
import ProgressTimeline from '../components/progress/ProgressTimeline';
import CravingLogger from '../components/progress/CravingLogger';
import CurrentStateLogger from '../components/progress/CurrentStateLogger';
import ProgressMilestones from '../components/progress/ProgressMilestones';
import AchievementsList from '../components/achievements/AchievementsList';

function ProgressPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthLoading = useSelector(selectAuthLoading);
  const progressData = useSelector(selectProgressData);
  const isProgressLoading = useSelector(selectProgressLoading);
  const progressError = useSelector(selectProgressError);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentAchievements, setRecentAchievements] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        if (!progressData) {
          await dispatch(fetchProgressData()).unwrap();
        }
        
        setRecentAchievements([
          {
            id: 1,
            title: "24 часа без сигарет",
            description: "Вы не курили целые сутки!",
            unlocked: true,
            unlocked_at: new Date('2023-12-02').toISOString()
          },
          {
            id: 2,
            title: "1 неделя без курения",
            description: "Вы не курили целую неделю!",
            unlocked: true,
            unlocked_at: new Date('2023-12-08').toISOString()
          },
          {
            id: 3,
            title: "1 месяц без курения",
            description: "Вы не курили целый месяц!",
            unlocked: true,
            unlocked_at: new Date('2024-01-01').toISOString()
          }
        ]);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные о прогрессе. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [isAuthenticated, dispatch, progressData]);

  if (isAuthLoading || isProgressLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="container mx-auto p-4">
          <div className="max-w-2xl mx-auto mt-8">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Мой прогресс
                </h1>
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Пожалуйста, войдите в систему, чтобы увидеть свой прогресс.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || progressError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="container mx-auto p-4">
          <div className="max-w-2xl mx-auto mt-8">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Мой прогресс
                </h1>
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error || progressError}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user.quit_date && (!progressData || !progressData.quit_date)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="container mx-auto p-4">
          <div className="max-w-2xl mx-auto mt-8">
            <div className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="card-body">
                <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Мой прогресс
                </h1>
                <h2 className="card-title text-2xl text-center mb-4">Начните свой путь к здоровью</h2>
                <p className="text-center mb-6 text-base-content/80">
                  Чтобы отслеживать прогресс, укажите дату отказа от курения и некоторую дополнительную информацию.
                </p>
                <QuitDateForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto p-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Мой прогресс
          </h1>
          <p className="text-lg text-base-content/70">
            Отслеживайте свой путь к здоровой жизни без курения
          </p>
        </div>
        
        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка */}
          <div className="space-y-8">
            {/* Статистика прогресса */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Ваша статистика</h2>
                <ProgressStats progressData={progressData} />
              </div>
            </div>
            
            {/* График улучшения здоровья */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Улучшения здоровья</h2>
                <ProgressChart progressData={progressData} />
              </div>
            </div>
            
            {/* Таймлайн прогресса */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body">
                <ProgressTimeline />
              </div>
            </div>
          </div>
          
          {/* Правая колонка */}
          <div className="space-y-8">
            {/* Логгер тяги */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body">
                <CravingLogger />
              </div>
            </div>
            
            {/* Логгер текущего состояния */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body">
                <CurrentStateLogger />
              </div>
            </div>
            
            {/* Вехи прогресса */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body">
                <ProgressMilestones />
              </div>
            </div>
            
            {/* Последние достижения */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Последние достижения</h2>
                <AchievementsList 
                  achievements={recentAchievements} 
                  isLoading={isLoading} 
                  showViewAll={true} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage; 