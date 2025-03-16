import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold mt-4 mb-6">Страница не найдена</h2>
        <p className="mb-8 text-base-content/70">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            Вернуться на главную
          </Link>
          <Link to="/resources" className="btn btn-outline">
            Полезные ресурсы
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage; 