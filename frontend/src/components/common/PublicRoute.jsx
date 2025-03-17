import React from 'react';

/**
 * Компонент для публичных маршрутов
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @returns {JSX.Element} Публичный маршрут
 */
function PublicRoute({ children }) {
  return children;
}

export default PublicRoute; 