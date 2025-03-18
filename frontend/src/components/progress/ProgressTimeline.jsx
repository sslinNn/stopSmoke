import { useSelector } from 'react-redux';
import { selectProgressData, selectProgressMilestones } from '../../store/slices/progressSlice';

function ProgressTimeline() {
  const progressData = useSelector(selectProgressData);
  const milestones = useSelector(selectProgressMilestones);
  
  if (!progressData || !progressData.quit_date) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">
          Установите дату отказа от курения, чтобы увидеть свой прогресс.
        </p>
      </div>
    );
  }
  
  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric' 
    });
  };
  
  // Рассчитываем важные даты для таймлайна
  const quitDate = new Date(progressData.quit_date);
  const now = new Date();
  const daysPassed = progressData.days_without_smoking || 0;
  
  // Создаем массив ключевых событий (день отказа + вехи + текущая дата)
  const timelineEvents = [
    {
      id: 'quit-date',
      date: quitDate,
      title: 'День отказа от курения',
      description: 'Вы начали свой путь к здоровью',
      type: 'start'
    },
    ...milestones.map(milestone => ({
      id: milestone.id,
      date: new Date(milestone.date),
      title: milestone.title,
      description: milestone.description,
      type: 'milestone',
      mood: milestone.mood
    })),
    {
      id: 'current-date',
      date: now,
      title: 'Сегодня',
      description: `${daysPassed} дней без курения`,
      type: 'current'
    }
  ];
  
  // Сортируем события по датам
  const sortedEvents = timelineEvents.sort((a, b) => a.date - b.date);
  
  // Определяем иконки для разных типов событий
  const getEventIcon = (type) => {
    switch (type) {
      case 'start':
        return (
          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'milestone':
        return (
          <div className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        );
      case 'current':
        return (
          <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-base-300 rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-lg">•</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Ваш путь без курения</h3>
      
      <div className="overflow-x-auto">
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {sortedEvents.map((event, index) => (
            <li key={event.id}>
              <div className="timeline-middle">
                {getEventIcon(event.type)}
              </div>
              <div className={`timeline-start md:text-end mb-4 ${index === 0 ? 'timeline-box' : ''}`}>
                <time className="font-mono italic">{formatDate(event.date)}</time>
                <div className="text-lg font-bold">{event.title}</div>
                {event.description && (
                  <p>{event.description}</p>
                )}
              </div>
              <hr/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProgressTimeline; 