import {
  Sparkles,
  MessageCircle,
  LogOut,
  LogIn,
  Zap,
  Heart,
  Brain,
  Gamepad2,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const PERSONALITIES = [
  {
    id: "sage",
    name: "Sage",
    icon: Brain,
    description: "Wise and thoughtful advisor",
    color: "from-purple-500 to-indigo-600",
    greeting:
      "Greetings! I am Sage, your thoughtful companion. How may I assist you with wisdom today?",
    traits: ["Philosophical", "Analytical", "Patient"],
  },
  {
    id: "spark",
    name: "Spark",
    icon: Zap,
    description: "Energetic and creative helper",
    color: "from-yellow-500 to-orange-600",
    greeting:
      "Hey there! Spark here, ready to ignite some creative solutions! What exciting project are we tackling?",
    traits: ["Creative", "Energetic", "Innovative"],
  },
  {
    id: "echo",
    name: "Echo",
    icon: Heart,
    description: "Empathetic and supportive friend",
    color: "from-pink-500 to-rose-600",
    greeting:
      "Hello friend! I'm Echo, here to listen and support you. What's on your mind today?",
    traits: ["Empathetic", "Supportive", "Understanding"],
  },
  {
    id: "pixel",
    name: "Pixel",
    icon: Gamepad2,
    description: "Fun and playful companion",
    color: "from-green-500 to-teal-600",
    greeting:
      "What's up! Pixel here, ready to make things fun and interesting! Let's dive into something cool!",
    traits: ["Playful", "Fun", "Casual"],
  },
  {
    id: "nova",
    name: "Nova",
    icon: BookOpen,
    description: "Knowledgeable research assistant",
    color: "from-blue-500 to-cyan-600",
    greeting:
      "Good day! Nova at your service. I'm here to help you explore knowledge and find answers. What shall we discover?",
    traits: ["Scholarly", "Precise", "Informative"],
  },
  {
    id: "atlas",
    name: "Atlas",
    icon: Briefcase,
    description: "Professional business advisor",
    color: "from-slate-600 to-slate-700",
    greeting:
      "Hello! Atlas here, your professional assistant. Ready to tackle business challenges and strategic thinking.",
    traits: ["Professional", "Strategic", "Efficient"],
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    picture?: string;
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPersonality, setSelectedPersonality] = useState("sage"); // ✅ Add personality selection state

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const user = localStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          setIsAuthenticated(true);

          if (parsedUser.picture) {
            const img = new Image();
            img.onload = () => setProfileImageLoaded(true);
            img.onerror = () => setProfileImageLoaded(false);
            img.src = parsedUser.picture;
          }
        }

        // ✅ Load saved personality preference
        const savedPersonality = localStorage.getItem("selectedPersonality");
        if (savedPersonality) {
          setSelectedPersonality(savedPersonality);
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

  // ✅ Handle personality selection
  const handlePersonalitySelect = (personalityId: string) => {
    setSelectedPersonality(personalityId);
    localStorage.setItem("selectedPersonality", personalityId);
    console.log(`Selected personality: ${personalityId}`);
  };

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
    // ✅ Pass selected personality to chat
    navigate("/chat", { state: { selectedPersonality } });
  };

  const ProfileAvatar = ({ size = "w-8 h-8", textSize = "text-sm" }) => {
    if (isLoading) {
      return (
        <div
          className={`${size} bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse`}
        ></div>
      );
    }

    if (userData?.picture && profileImageLoaded) {
      return (
        <img
          src={userData.picture}
          alt={userData.name || "Profile"}
          className={`${size} rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-lg`}
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <div
        className={`${size} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white ${textSize} font-medium shadow-lg`}
      >
        {userData?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    );
  };

  // ✅ Get current personality data
  const currentPersonality =
    PERSONALITIES.find((p) => p.id === selectedPersonality) || PERSONALITIES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-all duration-500">
      {/* Enhanced Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-indigo-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-900/80 dark:via-slate-800/60 dark:to-slate-900/40 backdrop-blur-xl"></div>
        </div>

        <div className="absolute top-4 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-8 right-32 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
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

            {/* ✅ Active Personality Indicator */}
            <div className="hidden lg:flex items-center gap-3 ml-6 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 bg-gradient-to-r ${currentPersonality.color} rounded-full animate-pulse shadow-sm`}
                ></div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {currentPersonality.name}
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Active
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 mr-25">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse backdrop-blur-sm"></div>
                  <div className="w-24 h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse"></div>
                </div>
                <div className="w-24 h-10 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50 shadow-sm">
                  <ProfileAvatar />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
                    {userData?.name || "User"}
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <div className="mb-8 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:scale-110">
                <MessageCircle className="w-12 h-12 text-white z-10 relative" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 border border-slate-200/30 dark:border-slate-700/30 rounded-full animate-spin [animation-duration:20s]"></div>
                <div className="absolute top-2 left-2 w-28 h-28 border border-slate-300/20 dark:border-slate-600/20 rounded-full animate-spin [animation-duration:15s] [animation-direction:reverse]"></div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-6 leading-tight">
              {isLoading ? (
                <div className="w-96 h-14 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mx-auto"></div>
              ) : isAuthenticated ? (
                <>
                  Welcome back,
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {userData?.name?.split(" ")[0] || "User"}!
                  </span>
                </>
              ) : (
                <>
                  Meet Your AI
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Personalities
                  </span>
                  <br />
                  <Button
                    onClick={handleStartChat}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Chatting with {currentPersonality.name}
                  </Button>
                </>
              )}
            </h2>

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

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-4xl mx-auto leading-relaxed">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="w-full h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                  <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mx-auto"></div>
                </div>
              ) : isAuthenticated ? (
                "Choose from six unique AI personalities, each designed to help you in different ways. Ready to continue our conversation?"
              ) : (
                "Choose from six unique AI personalities, each designed to help you in different ways. From creative brainstorming to professional advice, find the perfect companion for your needs."
              )}
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  6 Unique Personalities
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50">
                <Brain className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Advanced AI
                </span>
              </div>
            </div>

            {!isLoading && isAuthenticated && (
              <Button
                onClick={handleStartChat}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting with {currentPersonality.name}
              </Button>
            )}
          </div>

          {/* ✅ Personality Selection Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {PERSONALITIES.map((personality) => {
              const IconComponent = personality.icon;
              const isSelected = personality.id === selectedPersonality;

              return (
                <Card
                  key={personality.id}
                  onClick={() => handlePersonalitySelect(personality.id)} // ✅ Add click handler
                  className={`group p-8 cursor-pointer transition-all duration-500 border-2 backdrop-blur-xl relative overflow-hidden ${
                    isSelected
                      ? "border-blue-400/50 dark:border-blue-500/50 bg-gradient-to-br from-blue-50/80 via-white/60 to-purple-50/80 dark:from-blue-950/50 dark:via-slate-900/80 dark:to-purple-950/50 shadow-2xl scale-105 shadow-blue-500/20"
                      : "border-white/30 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 hover:shadow-xl hover:scale-102 hover:border-slate-300/50 dark:hover:border-slate-600/50"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10"></div>
                  )}

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${personality.color} rounded-3xl flex items-center justify-center mb-6 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl relative overflow-hidden`}
                    >
                      <IconComponent className="w-10 h-10 text-white z-10 relative" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                      {personality.name}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                      {personality.description}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {personality.traits.map((trait, traitIndex) => (
                        <span
                          key={traitIndex}
                          className="px-3 py-1 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20 dark:border-slate-600/50"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {isSelected && (
                      <div className="mt-4 w-full">
                        <div
                          className={`w-full h-1 bg-gradient-to-r ${personality.color} rounded-full shadow-sm`}
                        ></div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3 block">
                          ✨ Currently Selected
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

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
                        `Hello ${
                          userData?.name?.split(" ")[0] || "there"
                        }! I'm your AI assistant. How can I help you today?`
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
                      Absolutely! I'd love to help you brainstorm. What topic or
                      area are you looking to explore?
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
                Chat naturally and get intelligent responses tailored to your
                needs.
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
                Your AI assistant is ready to help you 24/7, whenever you need
                it.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
