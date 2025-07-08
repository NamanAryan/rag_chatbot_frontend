// components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      // Prevent multiple simultaneous auth checks
      if (hasChecked || isRedirecting) return;
      
      try {
        console.log('🔍 ProtectedRoute: Starting auth verification...');
        const isValid = await checkAuth();
        
        if (!isValid && !isRedirecting) {
          console.log('❌ ProtectedRoute: Authentication failed, redirecting to login');
          setIsRedirecting(true);
          
          // Use setTimeout to prevent navigation loop
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 100);
        }
      } catch (error) {
        console.error('❌ ProtectedRoute: Auth verification error:', error);
        if (!isRedirecting) {
          setIsRedirecting(true);
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 100);
        }
      } finally {
        setHasChecked(true);
      }
    };

    verifyAuth();
  }, [checkAuth, navigate, hasChecked, isRedirecting]);

  // Show loading while checking authentication
  if (isLoading || !hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4">Verifying authentication...</p>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Only render children if authenticated
  if (isAuthenticated) {
    return children;
  }

  // Fallback - should not reach here
  return null;
}
