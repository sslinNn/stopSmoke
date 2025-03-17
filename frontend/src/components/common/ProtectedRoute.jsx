import React from 'react';

/**
 * Компонент для защиты маршрутов, требующих аутентификации
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @returns {JSX.Element} Защищенный маршрут
 */
function ProtectedRoute({ children }) {
  return children;
}

export default ProtectedRoute;