// contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import type { ReactNode } from "react";

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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/json',
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' })
    }
  });
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const checkingRef = useRef<boolean>(false);
  const hasInitializedRef = useRef<boolean>(false);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (checkingRef.current) {
      console.log(
        "🔍 AuthContext: Auth check already in progress, skipping..."
      );
      return isAuthenticated;
    }

    checkingRef.current = true;

    try {
      console.log("🔍 AuthContext: Starting authentication check...");

      // ✅ Get token from localStorage
      const token = localStorage.getItem("authToken");
      console.log(
        "🔍 AuthContext: Token from localStorage:",
        token ? "Found" : "Not found"
      );

      if (!token) {
        console.log("❌ AuthContext: No token found in localStorage");
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const apiUrl = `${backendUrl}/protected`;

      console.log("🌐 AuthContext: Making request to:", apiUrl);
      console.log(
        "🔑 AuthContext: Using token:",
        token.substring(0, 20) + "..."
      );

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("🔍 AuthContext: Response status:", response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log("✅ AuthContext: Received user data:", userData);

        if (userData.user) {
          setUser(userData.user);
          setIsAuthenticated(true);
          console.log("✅ AuthContext: Successfully set authenticated state");
          return true;
        }
      } else {
        console.log(
          "❌ AuthContext: Authentication failed with status:",
          response.status
        );
        // If 401, token is invalid - clear it
        if (response.status === 401) {
          localStorage.removeItem("authToken");
        }
      }

      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error("❌ AuthContext: Network error:", error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
      checkingRef.current = false;
      console.log("🔧 AuthContext: Finally block completed");
    }
  }, [isAuthenticated]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Clear localStorage token
      localStorage.removeItem("authToken");

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      await fetch(`${backendUrl}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    console.log(
      "🔍 AuthProvider useEffect: hasInitialized:",
      hasInitializedRef.current
    );

    if (hasInitializedRef.current) return;

    hasInitializedRef.current = true;
    console.log("🔍 AuthProvider: Starting initial auth check...");

    // Direct call instead of timer
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("🔍 AuthContext State Update:");
    console.log("  isAuthenticated:", isAuthenticated);
    console.log("  isLoading:", isLoading);
    console.log("  user:", user);
  }, [isAuthenticated, isLoading, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
