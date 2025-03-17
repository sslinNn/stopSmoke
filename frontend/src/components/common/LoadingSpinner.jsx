function LoadingSpinner({ size = 'lg', fullHeight = true }) {
  return (
    <div className={`flex justify-center items-center ${fullHeight ? 'min-h-[70vh]' : ''}`}>
      <span className={`loading loading-spinner loading-${size}`}></span>
    </div>
  );
}

export default LoadingSpinner; 