// components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/protected', {
          credentials: 'include'
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4">Checking authentication...</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return null; 
  }

  return children;
}
