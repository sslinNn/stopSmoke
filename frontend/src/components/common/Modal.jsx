import { useEffect, useRef } from 'react';
import Button from './Button';

/**
 * Компонент модального окна
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isOpen - Открыто ли модальное окно
 * @param {function} props.onClose - Функция закрытия модального окна
 * @param {string} props.title - Заголовок модального окна
 * @param {React.ReactNode} props.children - Содержимое модального окна
 * @param {React.ReactNode} props.footer - Футер модального окна
 * @param {string} props.size - Размер модального окна (xs, sm, md, lg, xl)
 * @param {boolean} props.closeOnClickOutside - Закрывать ли при клике вне модального окна
 * @param {boolean} props.showCloseButton - Показывать ли кнопку закрытия
 * @returns {JSX.Element} Компонент модального окна
 */
function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
  showCloseButton = true
}) {
  const modalRef = useRef(null);
  
  // Обработчик клика вне модального окна
  const handleClickOutside = (e) => {
    if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Обработчик нажатия клавиши Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  // Добавляем и удаляем обработчики событий
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('overflow-hidden');
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, closeOnClickOutside]);
  
  // Определяем размеры
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className={`modal-box ${sizeClasses[size] || sizeClasses.md}`}
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="font-bold text-lg">{title}</h3>}
          
          {showCloseButton && (
            <button 
              className="btn btn-sm btn-circle btn-ghost" 
              onClick={onClose}
              aria-label="Закрыть"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="py-4">
          {children}
        </div>
        
        {footer && (
          <div className="modal-action">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;