import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';

function CravingTracker({ onCravingLogged }) {
  const { logCraving } = useUser();
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const triggers = [
    { id: 'stress', label: 'Стресс' },
    { id: 'food', label: 'После еды' },
    { id: 'alcohol', label: 'Алкоголь' },
    { id: 'social', label: 'Общение' },
    { id: 'boredom', label: 'Скука' },
    { id: 'habit', label: 'Привычка' },
    { id: 'coffee', label: 'Кофе' },
    { id: 'other', label: 'Другое' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!trigger) {
      setError('Пожалуйста, выберите триггер');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess(false);
    
    const result = await logCraving({
      intensity,
      trigger
    });
    
    if (result.success) {
      setSuccess(true);
      setTrigger('');
      setIntensity(5);
      
      // Вызываем колбэк, если он предоставлен
      if (onCravingLogged) {
        onCravingLogged(result);
      }
    } else {
      setError(result.error || 'Не удалось записать данные о тяге');
    }
    
    setIsSubmitting(false);
    
    // Сбрасываем сообщение об успехе через 3 секунды
    if (result.success) {
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Отслеживание тяги</h2>
        <p>Записывай моменты, когда возникает желание закурить, чтобы лучше понимать свои триггеры</p>
        
        {error && (
          <div className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Тяга успешно записана!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Интенсивность тяги (1-10)</span>
              <span className="label-text-alt">{intensity}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="range range-primary" 
            />
            <div className="w-full flex justify-between text-xs px-2 mt-1">
              <span>Слабая</span>
              <span>Средняя</span>
              <span>Сильная</span>
            </div>
          </div>
          
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Что вызвало тягу?</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {triggers.map(item => (
                <div key={item.id} className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input 
                      type="radio" 
                      name="trigger" 
                      className="radio radio-primary" 
                      value={item.id}
                      checked={trigger === item.id}
                      onChange={() => setTrigger(item.id)}
                    />
                    <span className="label-text">{item.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              Записать тягу
            </button>
          </div>
        </form>
        
        <div className="mt-4">
          <h3 className="font-bold">Совет дня:</h3>
          <p className="text-sm mt-2">
            Когда возникает тяга, попробуй глубоко дышать в течение 1 минуты. 
            Это поможет снизить стресс и отвлечься от желания закурить.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CravingTracker; 