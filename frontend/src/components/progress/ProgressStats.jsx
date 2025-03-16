function ProgressStats({ progressData }) {
  if (!progressData) return null;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
      <div className="stat">
        <div className="stat-title">Дней без курения</div>
        <div className="stat-value text-primary">{progressData.days_without_smoking || 0}</div>
        <div className="stat-desc">С {formatDate(progressData.quit_date)}</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">Не выкурено сигарет</div>
        <div className="stat-value">{progressData.cigarettes_not_smoked || 0}</div>
        <div className="stat-desc">Ваши лёгкие благодарны</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">Сэкономлено денег</div>
        <div className="stat-value text-secondary">{progressData.money_saved || 0}₽</div>
        <div className="stat-desc">Можно потратить на что-то полезное</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">Сэкономлено времени</div>
        <div className="stat-value">{progressData.time_saved || 0} ч</div>
        <div className="stat-desc">Больше времени для жизни</div>
      </div>
    </div>
  );
}

export default ProgressStats; 