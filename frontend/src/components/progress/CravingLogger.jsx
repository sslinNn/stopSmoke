import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  logCraving, 
  selectProgressLoading, 
  selectProgressError, 
  selectProgressSuccess 
} from '../../store/slices/progressSlice';
import LogService from '../../services/LogService';

function CravingLogger() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectProgressLoading);
  const error = useSelector(selectProgressError);
  const success = useSelector(selectProgressSuccess);
  
  const [intensity, setIntensity] = useState(5);
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [newAchievements, setNewAchievements] = useState([]);

  const triggers = [
    { id: 'stress', label: 'Стресс' },
    { id: 'food', label: 'После еды' },
    { id: 'social', label: 'Социальная ситуация' },
    { id: 'boredom', label: 'Скука' },
    { id: 'alcohol', label: 'Алкоголь' },
    { id: 'coffee', label: 'Кофе' },
    { id: 'other', label: 'Другое' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTrigger) {
      // Используем Redux error вместо локального состояния
      return;
    }

    setNewAchievements([]);

    try {
      LogService.progress('Отправка данных о тяге', { intensity, trigger: selectedTrigger });
      
      const result = await dispatch(logCraving({
        intensity,
        trigger: selectedTrigger
      })).unwrap();

      if (result.success) {
        LogService.progress('Тяга успешно записана');
        setSelectedTrigger('');
        setIntensity(5);
        
        if (result.newAchievements && result.newAchievements.length > 0) {
          LogService.achievements('Получены новые достижения', result.newAchievements);
          setNewAchievements(result.newAchievements);
        }
      }
    } catch (err) {
      LogService.error('Произошла ошибка при записи тяги', err);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Записать тягу к курению</h3>
      
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}
      
      {newAchievements.length > 0 && (
        <div className="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <span className="font-bold">Новые достижения!</span>
            <ul className="list-disc list-inside mt-1">
              {newAchievements.map(achievement => (
                <li key={achievement.id}>{achievement.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Интенсивность тяги (1-10)</span>
              <span className="label-text-alt">{intensity}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={intensity} 
              onChange={(e) => setIntensity(parseInt(e.target.value))} 
              className="range range-primary" 
              step="1"
            />
            <div className="w-full flex justify-between text-xs px-2 mt-1">
              <span>Слабая</span>
              <span>Средняя</span>
              <span>Сильная</span>
            </div>
          </label>
        </div>
        
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Что вызвало тягу?</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {triggers.map(trigger => (
                <button
                  key={trigger.id}
                  type="button"
                  className={`btn ${selectedTrigger === trigger.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedTrigger(trigger.id)}
                >
                  {trigger.label}
                </button>
              ))}
            </div>
          </label>
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || !selectedTrigger}
        >
          {isLoading ? 'Сохранение...' : 'Записать тягу'}
        </button>
      </form>
    </div>
  );
}

export default CravingLogger; 