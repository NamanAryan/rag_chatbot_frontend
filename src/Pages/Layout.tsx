// components/Layout.jsx
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import type { ReactNode } from "react";
const BACKEND_URL = import.meta.env.BACKEND_URL;
interface LayoutProps {
  children: ReactNode;
  headerProps?: Record<string, any>;
  footerProps?: Record<string, any>;
}

const Layout = ({
  children,
  headerProps = {},
  footerProps = {},
}: LayoutProps) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    userData: null,
  });

  useEffect(() => {
    const checkAuthStatus = () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            userData: parsedUser,
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            userData: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userData: null,
        });
      }
    };

    checkAuthStatus();

    // Listen for storage changes
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  const handleLogin = () => {
    // Redirect to your login page or open login modal
    window.location.href = "/login";
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    // Update state immediately
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      userData: null,
    });

    // Optional: Call logout endpoint
    fetch(`${BACKEND_URL}/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      console.log("Logout endpoint not available");
    });

    // Redirect
    window.location.href = "/";
  };

  // Merge auth state with header props
  const mergedHeaderProps = {
    ...authState,
    handleLogin,
    handleLogout,
    ...headerProps,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-all duration-500">
      <Header {...mergedHeaderProps} />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
      <Footer {...footerProps} />
    </div>
  );
};

export default Layout;
