import { Link } from 'react-router-dom';
import ErrorAlert from '../ui/ErrorAlert';

function AuthForm({ 
  title, 
  children, 
  error, 
  isLoading, 
  submitText, 
  loadingText, 
  onSubmit, 
  footerText, 
  footerLinkText, 
  footerLinkTo 
}) {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">{title}</h2>
          
          {error && <ErrorAlert message={error} />}

          <form onSubmit={onSubmit}>
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
          
          <div className="divider">ИЛИ</div>
          
          <div className="text-center">
            <p>{footerText}</p>
            <Link to={footerLinkTo} className="link link-primary">{footerLinkText}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm; 