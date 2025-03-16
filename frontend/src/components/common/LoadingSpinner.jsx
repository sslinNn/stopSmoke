function LoadingSpinner({ size = 'md', text = 'Загрузка...' }) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
    xl: 'loading-xl'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <span className={`loading loading-spinner ${sizeClass} text-primary`}></span>
      {text && <p className="mt-4 text-base-content/70">{text}</p>}
    </div>
  );
}

export default LoadingSpinner; 