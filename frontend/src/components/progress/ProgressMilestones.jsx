import { useSelector } from 'react-redux';
import { selectProgressMilestones } from '../../store/slices/progressSlice';

function ProgressMilestones() {
  const milestones = useSelector(selectProgressMilestones);

  // Если нет вех, показываем сообщение
  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center p-4">
        <h3 className="text-lg font-medium mb-2">Вехи прогресса</h3>
        <p className="text-gray-500">
          Отмечайте важные моменты вашего пути к жизни без курения.
          Они будут отображаться здесь.
        </p>
      </div>
    );
  }

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long'
    });
  };

  // Эмодзи для настроений
  const moodEmojis = {
    great: '😁',
    good: '🙂',
    neutral: '😐',
    bad: '😟',
    awful: '😫'
  };

  // Сортируем вехи от новых к старым
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Вехи прогресса</h3>
      
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        {sortedMilestones.map((milestone, index) => (
          <li key={milestone.id || index}>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={`timeline-start md:text-end mb-10 ${index === 0 ? 'timeline-box' : ''}`}>
              <time className="font-mono italic">{formatDate(milestone.date)}</time>
              <div className="text-lg font-bold">{milestone.title}</div>
              {milestone.description && (
                <p className="whitespace-pre-line">{milestone.description}</p>
              )}
              {milestone.mood && (
                <div className="mt-2">
                  <span className="text-xl">{moodEmojis[milestone.mood] || '😐'}</span>
                </div>
              )}
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProgressMilestones; 