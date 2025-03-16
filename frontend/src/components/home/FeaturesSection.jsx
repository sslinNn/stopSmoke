function FeaturesSection() {
  const features = [
    {
      icon: "📊",
      title: "Отслеживание прогресса",
      description: "Следи за своими достижениями и видь, как долго ты не куришь"
    },
    {
      icon: "💰",
      title: "Экономия денег",
      description: "Узнай, сколько денег ты сэкономил, отказавшись от сигарет"
    },
    {
      icon: "🫁",
      title: "Здоровье",
      description: "Наблюдай, как улучшается твоё здоровье с каждым днём без курения"
    },
    {
      icon: "👥",
      title: "Поддержка сообщества",
      description: "Общайся с единомышленниками и получай поддержку"
    }
  ];

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Возможности БросайКурить</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="card-title">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesSection; 