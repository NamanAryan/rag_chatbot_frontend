// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const checkingRef = useRef<boolean>(false);
  const hasInitializedRef = useRef<boolean>(false);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    console.log('🔍 checkAuth: Function called, checkingRef:', checkingRef.current);
    
    if (checkingRef.current) {
      console.log('🔍 AuthContext: Auth check already in progress, skipping...');
      return isAuthenticated;
    }

    checkingRef.current = true;
    console.log('🔍 checkAuth: Starting authentication check...');

    try {
      const backendUrl: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const apiUrl: string = `${backendUrl}/protected`;
      
      console.log('🌐 checkAuth: Making request to:', apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        headers: { 
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('✅ checkAuth: Response received, status:', response.status);
      
      if (response.ok) {
        const userData: { message: string; user: User } = await response.json();
        console.log('✅ checkAuth: User data parsed:', userData);
        
        if (userData.user) {
          setUser(userData.user);
          setIsAuthenticated(true);
          console.log('✅ checkAuth: Authentication successful');
          return true;
        }
      }
      
      console.log('❌ checkAuth: Authentication failed');
      setUser(null);
      setIsAuthenticated(false);
      return false;
      
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('❌ checkAuth: Request timed out');
      } else {
        console.error('❌ checkAuth: Network error:', error);
      }
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      console.log('🔧 checkAuth: Setting isLoading to false');
      setIsLoading(false);
      checkingRef.current = false;
      console.log('🔧 checkAuth: Finally block completed');
    }
  }, [isAuthenticated]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      const backendUrl: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      await fetch(`${backendUrl}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error: unknown) {
      console.error('Logout API call failed:', error);
    }
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    console.log('🔍 AuthProvider useEffect: hasInitialized:', hasInitializedRef.current);
    
    if (hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    console.log('🔍 AuthProvider: Starting initial auth check...');
    
    // Direct call instead of timer
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('🔍 AuthContext State Update:');
    console.log('  isAuthenticated:', isAuthenticated);
    console.log('  isLoading:', isLoading);
    console.log('  user:', user);
  }, [isAuthenticated, isLoading, user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      checkAuth,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
