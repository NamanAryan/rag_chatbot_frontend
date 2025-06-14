import { LogIn, LogOut, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    picture?: string;
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Add loading state
  const [profileImageLoaded, setProfileImageLoaded] = useState(false); // ✅ Track image loading

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const user = localStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          setIsAuthenticated(true);
          
          // Pre-load profile image if it exists
          if (parsedUser.picture) {
            const img = new Image();
            img.onload = () => setProfileImageLoaded(true);
            img.onerror = () => setProfileImageLoaded(false);
            img.src = parsedUser.picture;
          }
        }
      } catch (err) {
        console.error("Failed to parse user data");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });
      console.log("Logged out successfully");
    } catch (err) {
      console.log("Logout endpoint not available");
    }

    localStorage.removeItem("user");
    setUserData(null);
    setIsAuthenticated(false);
    setProfileImageLoaded(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleStartChat = () => {
    navigate("/chat");
  };

  // ✅ Profile Avatar Component
  const ProfileAvatar = ({ size = "w-8 h-8", textSize = "text-sm" }) => {
    if (isLoading) {
      return (
        <div className={`${size} bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse`}></div>
      );
    }

    if (userData?.picture && profileImageLoaded) {
      return (
        <img
          src={userData.picture}
          alt={userData.name || "Profile"}
          className={`${size} rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm`}
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <div className={`${size} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white ${textSize} font-medium`}>
        {userData?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            AI Assistant
          </h1>
        </div>

        {isLoading ? (
          // ✅ Loading skeleton for header
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse"></div>
              <div className="w-20 h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
            </div>
            <div className="w-20 h-9 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <ProfileAvatar />
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                {userData?.name || "User"}
              </span>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-colors border-slate-200 dark:border-slate-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={handleLogin}
            className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-slate-200 dark:border-slate-600"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        )}
        <DarkModeToggle />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              {isLoading ? (
                <div className="w-96 h-10 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mx-auto"></div>
              ) : isAuthenticated ? (
                `Welcome back, ${userData?.name?.split(" ")[0] || "User"}!`
              ) : (
                "Welcome to Your AI Assistant"
              )}
            </h2>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="w-full h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                  <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mx-auto"></div>
                </div>
              ) : isAuthenticated ? (
                "Ready to continue our conversation? Ask me anything you need help with!"
              ) : (
                "Start a conversation and let our AI help you with anything you need. Ask questions, get creative, or just have a chat."
              )}
            </p>

            {!isLoading && isAuthenticated && (
              <Button
                onClick={handleStartChat}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting
              </Button>
            )}
          </div>

          {/* User Profile Card */}
          {!isLoading && isAuthenticated && userData && (
            <div className="max-w-md mx-auto mb-12">
              <Card className="p-6 shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <ProfileAvatar size="w-16 h-16" textSize="text-xl" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {userData.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {userData.email}
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        ● Online
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Chat Preview */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="text-slate-700 dark:text-slate-200">
                      {isLoading ? (
                        <div className="w-48 h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                      ) : isAuthenticated ? (
                        `Hello ${userData?.name?.split(" ")[0] || "there"}! I'm your AI assistant. How can I help you today?`
                      ) : (
                        "Hello! I'm your AI assistant. How can I help you today?"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                    <p>Can you help me brainstorm some ideas?</p>
                  </div>
                  <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {!isLoading && isAuthenticated ? (
                      <ProfileAvatar />
                    ) : (
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        You
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                    <p className="text-slate-700 dark:text-slate-200">
                      Absolutely! I'd love to help you brainstorm. What topic or area are you looking to explore?
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-3 items-center">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-700 rounded-full px-4 py-3 text-slate-500 dark:text-slate-400">
                    Type your message here...
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={isAuthenticated ? handleStartChat : handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : isAuthenticated ? "Send" : "Sign In"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Natural Conversations
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Chat naturally and get intelligent responses tailored to your needs.
              </p>
            </Card>

            <Card className="p-6 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Creative Solutions
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Get creative ideas and innovative solutions to your challenges.
              </p>
            </Card>

            <Card className="p-6 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-600 dark:bg-green-400 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Always Available
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Your AI assistant is ready to help you 24/7, whenever you need it.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
