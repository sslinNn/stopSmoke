function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Регистрация",
      description: "Создай аккаунт и укажи свои привычки курения"
    },
    {
      number: "02",
      title: "Установка цели",
      description: "Выбери дату отказа от курения и поставь цели"
    },
    {
      number: "03",
      title: "Отслеживание",
      description: "Отмечай свой прогресс и получай статистику"
    },
    {
      number: "04",
      title: "Поддержка",
      description: "Получай советы и поддержку сообщества на пути к здоровью"
    }
  ];

  return (
    <div className="py-12 bg-base-200 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex-1">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                  {step.number}
                </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-center">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block h-0.5 bg-primary mt-6 relative">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-45 w-3 h-0.5 bg-primary"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -rotate-45 w-3 h-0.5 bg-primary"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorksSection; 