import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [authVerified, setAuthVerified] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const isValid = await checkAuth();
      
      if (!isValid) {
        console.log('❌ ProtectedRoute: Authentication failed, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }
      
      setAuthVerified(true);
    };
    verifyAuth();
  }, [checkAuth, navigate]);

  if (isLoading || !authVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4">Verifying authentication...</p>
      </div>
    );
  }

  if (isAuthenticated && authVerified) {
    return children;
  }

  return null;
}
