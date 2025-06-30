import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthRedirect() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Add a small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStatus('Verifying credentials...');
        
        const response = await fetch('/protected', {
          credentials: 'include'
        });
        
        if (response.ok) {
          setStatus('✅ Authentication successful! Redirecting...');
          setTimeout(() => navigate('/login'), 1000);
        } else {
          setStatus('❌ Authentication failed. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        setStatus('❌ Authentication error. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>{status}</p>
      </div>
    </div>
  );
}
// This component handles the OAuth redirect and checks authentication status
// It displays a loading spinner and status messages while processing