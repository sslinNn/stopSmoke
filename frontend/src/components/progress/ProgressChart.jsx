function ProgressChart({ progressData }) {
  if (!progressData) return null;

  const days = progressData.days_without_smoking || 0;

  return (
    <div className="w-full">
      <div className="mb-4">
        <p className="text-sm mb-2">Улучшения здоровья после отказа от курения:</p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <div className="w-16 text-center text-xs">20 мин</div>
          <div className="flex-1 relative">
            <div className="h-1 bg-base-300 w-full"></div>
            <div className={`h-1 bg-primary absolute top-0 left-0 ${days > 0 ? 'w-full' : 'w-0'}`}></div>
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${days > 0 ? 'bg-primary' : 'bg-base-300'}`}></div>
          </div>
          <div className="w-48 text-xs ml-2">
            <span className={days > 0 ? 'font-bold text-primary' : ''}>
              Нормализация пульса и артериального давления
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-16 text-center text-xs">12 часов</div>
          <div className="flex-1 relative">
            <div className="h-1 bg-base-300 w-full"></div>
            <div className={`h-1 bg-primary absolute top-0 left-0 ${days > 0.5 ? 'w-full' : 'w-0'}`}></div>
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${days > 0.5 ? 'bg-primary' : 'bg-base-300'}`}></div>
          </div>
          <div className="w-48 text-xs ml-2">
            <span className={days > 0.5 ? 'font-bold text-primary' : ''}>
              Нормализация уровня угарного газа в крови
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-16 text-center text-xs">2 дня</div>
          <div className="flex-1 relative">
            <div className="h-1 bg-base-300 w-full"></div>
            <div className={`h-1 bg-primary absolute top-0 left-0 ${days >= 2 ? 'w-full' : 'w-0'}`}></div>
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${days >= 2 ? 'bg-primary' : 'bg-base-300'}`}></div>
          </div>
          <div className="w-48 text-xs ml-2">
            <span className={days >= 2 ? 'font-bold text-primary' : ''}>
              Улучшение обоняния и вкуса
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-16 text-center text-xs">2 недели</div>
          <div className="flex-1 relative">
            <div className="h-1 bg-base-300 w-full"></div>
            <div className={`h-1 bg-primary absolute top-0 left-0 ${days >= 14 ? 'w-full' : 'w-0'}`}></div>
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${days >= 14 ? 'bg-primary' : 'bg-base-300'}`}></div>
          </div>
          <div className="w-48 text-xs ml-2">
            <span className={days >= 14 ? 'font-bold text-primary' : ''}>
              Улучшение кровообращения и функции легких
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-16 text-center text-xs">1 месяц</div>
          <div className="flex-1 relative">
            <div className="h-1 bg-base-300 w-full"></div>
            <div className={`h-1 bg-primary absolute top-0 left-0 ${days >= 30 ? 'w-full' : 'w-0'}`}></div>
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${days >= 30 ? 'bg-primary' : 'bg-base-300'}`}></div>
          </div>
          <div className="w-48 text-xs ml-2">
            <span className={days >= 30 ? 'font-bold text-primary' : ''}>
              Уменьшение кашля и одышки
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-16 text-center text-xs">1 год</div>
          <div className="flex-1 relative">
            <div className="h-1 bg-base-300 w-full"></div>
            <div className={`h-1 bg-primary absolute top-0 left-0 ${days >= 365 ? 'w-full' : 'w-0'}`}></div>
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${days >= 365 ? 'bg-primary' : 'bg-base-300'}`}></div>
          </div>
          <div className="w-48 text-xs ml-2">
            <span className={days >= 365 ? 'font-bold text-primary' : ''}>
              Риск сердечно-сосудистых заболеваний снижается на 50%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressChart; 