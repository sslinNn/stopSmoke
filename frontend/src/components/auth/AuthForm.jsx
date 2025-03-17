import { Link } from 'react-router-dom';

/**
 * Базовый компонент формы аутентификации
 * @param {Object} props - Свойства компонента
 * @returns {JSX.Element} Компонент формы аутентификации
 */
function AuthForm({ 
  title, 
  children, 
  error, 
  success,
  isLoading, 
  submitText, 
  loadingText, 
  onSubmit, 
  footerText, 
  footerLinkText, 
  footerLinkTo,
  dividerText = 'ИЛИ',
  showDivider = true,
  showFooter = true,
  className = ''
}) {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className={`card w-full max-w-md bg-base-100 shadow-xl ${className}`}>
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">{title}</h2>
          
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {children}
            
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? loadingText : submitText}
              </button>
            </div>
          </form>
          
          {showDivider && <div className="divider">{dividerText}</div>}
          
          {showFooter && (
            <div className="text-center">
              <p>{footerText}</p>
              <Link to={footerLinkTo} className="link link-primary">{footerLinkText}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthForm; 