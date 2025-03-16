import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="hero min-h-[70vh] bg-base-200 rounded-lg">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">БросайКурить</h1>
          <p className="py-6">Начни свой путь к здоровой жизни без сигарет. Отслеживай прогресс, получай поддержку сообщества и достигай своих целей!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-primary">Начать путь</Link>
            <Link to="/login" className="btn btn-outline">Уже с нами?</Link>
          </div>
          <div className="mt-6 stats shadow">
            <div className="stat place-items-center">
              <div className="stat-title">Пользователей</div>
              <div className="stat-value">12K+</div>
              <div className="stat-desc">Присоединились к нам</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Дней без курения</div>
              <div className="stat-value text-primary">1.2M+</div>
              <div className="stat-desc text-primary">↗︎ 90% успешных попыток</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Сэкономлено</div>
              <div className="stat-value">7.5M₽</div>
              <div className="stat-desc">На сигаретах</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection; 