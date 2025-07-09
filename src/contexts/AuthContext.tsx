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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const checkingRef = useRef<boolean>(false);
  const hasInitializedRef = useRef<boolean>(false);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (checkingRef.current) {
      return isAuthenticated;
    }

    checkingRef.current = true;

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("❌ No token found in localStorage");
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsAuthenticated(true);
        return true;
      } else {
        // Token invalid, clear it
        localStorage.removeItem("authToken");
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
      checkingRef.current = false;
    }
  }, [isAuthenticated]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Clear localStorage token
      localStorage.removeItem("authToken");

      // Optional: call backend logout (but don't depend on it)
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
