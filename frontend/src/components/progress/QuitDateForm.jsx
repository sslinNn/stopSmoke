import { useState } from 'react';
import logger from '../../services/LogService';

function QuitDateForm() {
  const { setupQuitDate } = useUser();
  const [quitDate, setQuitDate] = useState('');
  const [cigarettesPerDay, setCigarettesPerDay] = useState(10);
  const [packPrice, setPackPrice] = useState(200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Получаем текущую дату в формате YYYY-MM-DD для ограничения выбора даты
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    if (!quitDate) {
      setError('Пожалуйста, выберите дату отказа от курения');
      return;
    }
    
    if (cigarettesPerDay < 1) {
      setError('Количество сигарет должно быть больше 0');
      return;
    }
    
    if (packPrice < 1) {
      setError('Цена пачки должна быть больше 0');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      
      logger.debug('Отправка данных о дате отказа', { 
        quitDate, 
        cigarettesPerDay, 
        packPrice 
      });
      
      const result = await setupQuitDate({
        quit_date: quitDate,
        cigarettes_per_day: cigarettesPerDay,
        pack_price: packPrice
      });
      
      if (result.success) {
        logger.progress('Дата отказа от курения установлена успешно');
        setSuccess('Дата отказа от курения успешно установлена');
      } else {
        setError(result.error || 'Не удалось установить дату отказа от курения');
      }
    } catch (err) {
      logger.error('Ошибка при установке даты отказа', err);
      setError('Произошла ошибка при установке даты отказа от курения');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-error mb-4">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
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
            onChange={(e) => setQuitDate(e.target.value)}
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
          className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Начать путь к здоровью'}
        </button>
      </form>
    </div>
  );
}

export default QuitDateForm; 