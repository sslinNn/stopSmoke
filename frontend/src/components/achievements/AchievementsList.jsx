import { Link } from 'react-router-dom';
import AchievementCard from './AchievementCard';
import LoadingSpinner from '../common/LoadingSpinner';

function AchievementsList({ achievements, isLoading, showViewAll = false }) {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!achievements || achievements.length === 0) {
    return (
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">У вас пока нет достижений</h3>
          <div className="text-xs">Продолжайте ваш путь к здоровью, и вы скоро получите свои первые достижения!</div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(achievement => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement} 
          />
        ))}
      </div>
      
      {showViewAll && achievements.length > 0 && (
        <div className="mt-6 text-center">
          <Link to="/achievements" className="btn btn-outline btn-primary">
            Посмотреть все достижения
          </Link>
        </div>
      )}
    </div>
  );
}

export default AchievementsList; 