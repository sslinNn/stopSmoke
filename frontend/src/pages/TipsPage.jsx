import { useState } from 'react';

function TipsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'Все советы' },
    { id: 'cravings', name: 'Борьба с тягой' },
    { id: 'health', name: 'Здоровье' },
    { id: 'motivation', name: 'Мотивация' },
    { id: 'lifestyle', name: 'Образ жизни' }
  ];
  
  const tips = [
    {
      id: 1,
      category: 'cravings',
      title: 'Техника 4-7-8 для борьбы с тягой',
      content: 'Когда возникает сильная тяга к сигарете, попробуй дыхательную технику 4-7-8: вдохни через нос на 4 счета, задержи дыхание на 7 счетов, выдохни через рот на 8 счетов. Повтори 3-4 раза.',
      source: 'Доктор Эндрю Вейл, специалист по интегративной медицине'
    },
    {
      id: 2,
      category: 'health',
      title: 'Восстановление после отказа от курения',
      content: 'Уже через 20 минут после последней сигареты пульс и давление начинают нормализоваться. Через 12 часов уровень угарного газа в крови снижается до нормы. Через 2 недели улучшается кровообращение и функция легких.',
      source: 'Всемирная организация здравоохранения'
    },
    {
      id: 3,
      category: 'motivation',
      title: 'Визуализация целей',
      content: 'Создай список причин, почему ты хочешь бросить курить. Держи его всегда под рукой и перечитывай, когда возникает желание закурить. Можно также создать доску визуализации с изображениями здорового образа жизни.',
      source: 'Психологические исследования мотивации'
    },
    {
      id: 4,
      category: 'lifestyle',
      title: 'Замена привычек',
      content: 'Замени курение на здоровые привычки. Например, вместо перекура делай короткую прогулку, выпей стакан воды или съешь фрукт. Постепенно мозг перестроится на новые ритуалы.',
      source: 'Исследования поведенческой психологии'
    },
    {
      id: 5,
      category: 'cravings',
      title: 'Отвлечение внимания',
      content: 'Когда хочется закурить, займи руки чем-то: сжимай антистресс-мячик, перебирай четки, рисуй или играй в простые игры на телефоне. Это помогает преодолеть физическую привычку держать сигарету.',
      source: 'Методы когнитивно-поведенческой терапии'
    },
    {
      id: 6,
      category: 'health',
      title: 'Питание при отказе от курения',
      content: 'Включи в рацион больше фруктов и овощей, особенно богатых витамином C. Они помогают организму быстрее вывести никотин и восстановить повреждения. Ограничь кофеин, который может усиливать тягу к сигаретам.',
      source: 'Диетологические рекомендации'
    },
    {
      id: 7,
      category: 'motivation',
      title: 'Отслеживание прогресса',
      content: 'Веди дневник своего прогресса. Записывай, сколько дней ты не куришь, как изменилось самочувствие, сколько денег сэкономил. Это поможет увидеть реальные результаты и укрепит мотивацию.',
      source: 'Техники самомониторинга'
    },
    {
      id: 8,
      category: 'lifestyle',
      title: 'Физическая активность',
      content: 'Регулярные физические упражнения помогают справиться с тягой к никотину, снижают стресс и улучшают настроение. Даже 15-20 минут умеренной активности в день могут значительно облегчить процесс отказа от курения.',
      source: 'Спортивная медицина'
    }
  ];
  
  const filteredTips = activeCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Советы по отказу от курения</h2>
          <p>Полезные рекомендации, которые помогут тебе справиться с тягой и сохранить мотивацию</p>
          
          <div className="tabs tabs-boxed mt-4">
            {categories.map(category => (
              <a 
                key={category.id}
                className={`tab ${activeCategory === category.id ? 'tab-active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTips.map(tip => (
          <div key={tip.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{tip.title}</h3>
              <p>{tip.content}</p>
              <div className="text-sm opacity-70 mt-2">Источник: {tip.source}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="card bg-primary text-primary-content">
        <div className="card-body">
          <h3 className="card-title">Нужна дополнительная помощь?</h3>
          <p>Если тебе сложно справиться самостоятельно, не стесняйся обратиться за профессиональной помощью. Консультация специалиста может значительно повысить шансы на успех.</p>
          <div className="card-actions justify-end">
            <button className="btn">Найти специалиста</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TipsPage; 