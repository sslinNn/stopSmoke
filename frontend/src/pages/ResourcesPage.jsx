function ResourcesPage() {
  const resources = [
    {
      id: 1,
      title: 'Как бросить курить: пошаговое руководство',
      description: 'Подробное руководство по отказу от курения с практическими советами и стратегиями.',
      url: 'https://www.takzdorovo.ru/privychki/kurenie/kak-brosit-kurit/',
      category: 'guide'
    },
    {
      id: 2,
      title: 'Влияние курения на здоровье',
      description: 'Научные данные о влиянии курения на различные системы организма и риски для здоровья.',
      url: 'https://www.who.int/ru/news-room/fact-sheets/detail/tobacco',
      category: 'health'
    },
    {
      id: 3,
      title: 'Психологические аспекты никотиновой зависимости',
      description: 'Анализ психологических механизмов формирования и поддержания никотиновой зависимости.',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2928221/',
      category: 'psychology'
    },
    {
      id: 4,
      title: 'Методы преодоления тяги к курению',
      description: 'Практические методы и техники для преодоления тяги к курению в различных ситуациях.',
      url: 'https://www.cancer.org/healthy/stay-away-from-tobacco/guide-quitting-smoking/withdrawal.html',
      category: 'guide'
    },
    {
      id: 5,
      title: 'Никотинзаместительная терапия',
      description: 'Информация о различных видах никотинзаместительной терапии и их эффективности.',
      url: 'https://www.cochrane.org/CD000146/TOBACCO_do-nicotine-replacement-therapies-help-people-stop-smoking',
      category: 'health'
    },
    {
      id: 6,
      title: 'Поддержка близких при отказе от курения',
      description: 'Рекомендации для родственников и друзей по поддержке человека, бросающего курить.',
      url: 'https://smokefree.gov/help-others-quit/family-friends',
      category: 'psychology'
    },
    {
      id: 7,
      title: 'Экономические выгоды отказа от курения',
      description: 'Расчеты и примеры экономии средств при отказе от курения в долгосрочной перспективе.',
      url: 'https://www.nhs.uk/better-health/quit-smoking/financial-benefits-of-quitting-smoking/',
      category: 'motivation'
    },
    {
      id: 8,
      title: 'Истории успеха: как люди бросили курить',
      description: 'Реальные истории людей, успешно отказавшихся от курения, их опыт и советы.',
      url: 'https://www.cdc.gov/tobacco/campaign/tips/stories/index.html',
      category: 'motivation'
    }
  ];

  const categories = [
    { id: 'guide', name: 'Руководства', icon: '📚' },
    { id: 'health', name: 'Здоровье', icon: '❤️' },
    { id: 'psychology', name: 'Психология', icon: '🧠' },
    { id: 'motivation', name: 'Мотивация', icon: '🚀' }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Полезные ресурсы</h1>
      
      <p className="mb-8">
        На этой странице собраны полезные ресурсы, которые помогут вам в процессе отказа от курения. 
        Здесь вы найдете научные статьи, практические руководства, психологические техники и истории успеха.
      </p>
      
      {categories.map(category => (
        <div key={category.id} className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources
              .filter(resource => resource.category === category.id)
              .map(resource => (
                <div key={resource.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div className="card-actions justify-end mt-4">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-primary btn-sm"
                      >
                        Перейти к ресурсу
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      
      <div className="alert alert-info mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Важно!</h3>
          <div className="text-sm">
            Информация на этой странице носит ознакомительный характер и не заменяет консультацию специалиста. 
            При наличии серьезных проблем со здоровьем, пожалуйста, обратитесь к врачу.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage; 