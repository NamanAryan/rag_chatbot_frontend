// components/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, LogOut, LogIn, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { DarkModeToggle } from "../DarkModeToggle";

type UserData = {
  picture: string | undefined;
  name?: string;
  email?: string;
};

type HeaderProps = {
  isAuthenticated?: boolean;
  isLoading?: boolean;
  userData?: UserData | null;
  currentPersonality?: { name: string; color: string } | null;
  handleLogin?: () => void;
  handleLogout?: () => void;
  PERSONALITIES?: Array<any>;
};

const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  isLoading = false,
  userData = null,
  currentPersonality = null,
  handleLogin = () => {
    window.location.href = "/login";
  },
  handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    window.location.reload(); 
  },
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authState, setAuthState] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      const isLoggedIn = !!user;
      setAuthState(isLoggedIn);
    };

    checkAuth();

    // Check every second to catch changes
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const defaultPersonality = {
    name: "Creative",
    color: "from-pink-500 to-rose-600",
  };

  const activePersonality = currentPersonality || defaultPersonality;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/features", label: "Features" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const ProfileAvatar = () => {
    let user = userData;
    if (!user) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error("Error parsing user from localStorage:", e);
        }
      }
    }

    // Use the same logic as your header code
    if (user?.picture) {
      return (
        <img
          src={user.picture}
          alt={user.name || "Profile"}
          className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm"
          referrerPolicy="no-referrer"
        />
      );
    } else {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      );
    }
  };

  // Use authState OR isAuthenticated prop
  const showLoggedIn = authState || isAuthenticated;
  return (
    <header className="relative overflow-hidden border-b border-slate-200/20 dark:border-slate-700/20 sticky top-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-indigo-500/10">
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"></div>
      </div>

      <div className="absolute top-8 left-32 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-12 right-40 w-16 h-16 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>

      <div className="relative z-10 flex items-center justify-between p-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                NeuraChat
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                AI Personality Hub
              </p>
            </div>
          </Link>

          {currentPersonality && (
            <div className="hidden lg:flex items-center gap-3 ml-6 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 bg-gradient-to-r ${activePersonality.color} rounded-full animate-pulse shadow-sm`}
                ></div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {activePersonality.name}
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Active
              </span>
            </div>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-between p-6 ml-60">
          <div className="flex items-center gap-4"></div>
          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative group ${
                  isActivePath(link.path)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
                {isActivePath(link.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>
        {/* Time and User Section */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 mr-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          {/* User Authentication Section */}
          {isLoading ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse backdrop-blur-sm"></div>
                <div className="w-24 h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse"></div>
              </div>
              <div className="w-24 h-10 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse"></div>
            </div>
          ) : showLoggedIn ? (
            <>
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50 shadow-sm">
                <ProfileAvatar />
                <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
                  {userData?.name ||
                    (() => {
                      try {
                        return (
                          JSON.parse(localStorage.getItem("user") || "{}")
                            ?.name || "User"
                        );
                      } catch {
                        return "User";
                      }
                    })()}
                </span>
              </div>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50 hover:bg-red-50/80 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Logout
                </span>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={handleLogin}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-semibold">Sign In</span>
            </Button>
          )}

          <DarkModeToggle />

          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden relative z-10 border-t border-slate-200/20 dark:border-slate-700/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <nav className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-lg font-medium transition-colors ${
                  isActivePath(link.path)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {showLoggedIn && (
              <div className="pt-4 border-t border-slate-200/20 dark:border-slate-700/20">
                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <ProfileAvatar />
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {userData?.name ||
                        (() => {
                          try {
                            return (
                              JSON.parse(localStorage.getItem("user") || "{}")
                                ?.name || "User"
                            );
                          } catch {
                            return "User";
                          }
                        })()}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {userData?.email ||
                        (() => {
                          try {
                            return (
                              JSON.parse(localStorage.getItem("user") || "{}")
                                ?.email || ""
                            );
                          } catch {
                            return "";
                          }
                        })()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200/20 dark:border-slate-700/20">
              {showLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
