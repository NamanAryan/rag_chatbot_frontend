// In your AuthRedirect component (the /google route)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthRedirect() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        console.log('✅ Token stored in localStorage');
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Check authentication
        const isAuthenticated = await checkAuth();
        
        if (isAuthenticated) {
          console.log('✅ Authentication successful');
          navigate('/', { replace: true });
        } else {
          console.log('❌ Authentication failed');
          navigate('/login?error=token_invalid', { replace: true });
        }
      } else {
        console.log('❌ No token in URL');
        navigate('/login?error=no_token', { replace: true });
      }
    };

    handleAuthSuccess();
  }, [checkAuth, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
