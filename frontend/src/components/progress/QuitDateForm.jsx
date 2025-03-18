import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setQuitDate, 
  selectProgressLoading, 
  selectProgressError, 
  selectProgressSuccess 
} from '../../store/slices/progressSlice';

function QuitDateForm() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectProgressLoading);
  const error = useSelector(selectProgressError);
  const success = useSelector(selectProgressSuccess);
  
  const [quitDate, setQuitDateValue] = useState('');
  const [cigarettesPerDay, setCigarettesPerDay] = useState(10);
  const [packPrice, setPackPrice] = useState(200);

  // Получаем текущую дату в формате YYYY-MM-DD для ограничения выбора даты
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы на стороне клиента
    if (!quitDate) {
      return;
    }
    
    if (cigarettesPerDay < 1) {
      return;
    }
    
    if (packPrice < 1) {
      return;
    }
    
    try {
      await dispatch(setQuitDate({
        quit_date: quitDate,
        cigarettes_per_day: cigarettesPerDay,
        price_per_pack: packPrice
      })).unwrap();
    } catch (err) {
      console.error('Ошибка при установке даты отказа:', err);
    }
  };

  return (
    <div>
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
      
      <form onSubmit={handleSubmit}>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Дата отказа от курения</span>
          </label>
          <input 
            type="date" 
            value={quitDate} 
            onChange={(e) => setQuitDateValue(e.target.value)}
            max={today}
            className="input input-bordered" 
            required
          />
          <label className="label">
            <span className="label-text-alt">Выберите дату, когда вы бросили или планируете бросить курить</span>
          </label>
        </div>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Сколько сигарет в день вы курили?</span>
            <span className="label-text-alt">{cigarettesPerDay}</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="60" 
            value={cigarettesPerDay} 
            onChange={(e) => setCigarettesPerDay(parseInt(e.target.value))} 
            className="range range-primary" 
          />
          <div className="w-full flex justify-between text-xs px-2 mt-1">
            <span>1</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
          </div>
        </div>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Цена пачки сигарет (₽)</span>
          </label>
          <input 
            type="number" 
            value={packPrice} 
            onChange={(e) => setPackPrice(parseInt(e.target.value) || 0)}
            min="1"
            className="input input-bordered" 
            required
          />
          <label className="label">
            <span className="label-text-alt">Эта информация поможет рассчитать, сколько денег вы сэкономите</span>
          </label>
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Сохранение...' : 'Начать путь к здоровью'}
        </button>
      </form>
    </div>
  );
}

export default QuitDateForm; 