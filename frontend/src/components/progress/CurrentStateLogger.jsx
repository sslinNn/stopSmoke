import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  logCurrentState, 
  selectProgressLoading, 
  selectProgressError, 
  selectProgressSuccess 
} from '../../store/slices/progressSlice';

function CurrentStateLogger() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectProgressLoading);
  const error = useSelector(selectProgressError);
  const success = useSelector(selectProgressSuccess);

  const [mood, setMood] = useState('neutral');
  const [description, setDescription] = useState('');
  const [isMilestone, setIsMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');

  const moods = [
    { id: 'great', label: 'Отлично', emoji: '😁' },
    { id: 'good', label: 'Хорошо', emoji: '🙂' },
    { id: 'neutral', label: 'Нормально', emoji: '😐' },
    { id: 'bad', label: 'Плохо', emoji: '😟' },
    { id: 'awful', label: 'Ужасно', emoji: '😫' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const stateData = {
      mood,
      description,
      date: new Date().toISOString(),
      is_milestone: isMilestone,
      title: milestoneTitle
    };
    
    await dispatch(logCurrentState(stateData));
    
    // Сбрасываем форму только при успешной отправке
    if (!error) {
      setDescription('');
      setIsMilestone(false);
      setMilestoneTitle('');
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Как вы себя чувствуете сегодня?</h3>
      
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Настроение</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {moods.map(m => (
                <button
                  key={m.id}
                  type="button"
                  className={`btn ${mood === m.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setMood(m.id)}
                >
                  <span className="text-xl mr-1">{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>
          </label>
        </div>
        
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Опишите своё состояние</span>
            </div>
            <textarea 
              className="textarea textarea-bordered h-24"
              placeholder="Как вы себя чувствуете? С какими трудностями сталкиваетесь?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input 
              type="checkbox" 
              className="checkbox checkbox-primary" 
              checked={isMilestone}
              onChange={(e) => setIsMilestone(e.target.checked)} 
            />
            <span className="label-text">Это важная веха в моем пути</span>
          </label>
        </div>
        
        {isMilestone && (
          <div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Название вехи</span>
              </div>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                placeholder="Например: Первая неделя без сигарет"
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
                required={isMilestone}
              />
            </label>
          </div>
        )}
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Сохранение...' : 'Сохранить состояние'}
        </button>
      </form>
    </div>
  );
}

export default CurrentStateLogger; 