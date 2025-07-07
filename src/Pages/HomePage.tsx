import {
  Sparkles,
  MessageCircle,
  Brain,
  GraduationCap,
  Lightbulb,
  Search,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "./Footer";
const PERSONALITIES = [
  {
    id: "scholar",
    name: "Scholar",
    icon: GraduationCap,
    description: "Academic mentor focused on deep learning",
    color: "from-indigo-500 to-purple-600",
    greeting:
      "Greetings, fellow learner! Scholar here to help you master any subject. What knowledge shall we explore?",
    traits: ["Academic", "Thorough", "Patient"],
  },
  {
    id: "blaze",
    name: "Blaze",
    icon: Lightbulb,
    description: "Creative fire for innovative projects",
    color: "from-orange-500 to-red-600",
    greeting:
      "What's up! Blaze here, ready to ignite your creativity! Got any cool projects we can brainstorm?",
    traits: ["Creative", "Energetic", "Innovative"],
  },
  {
    id: "buddy",
    name: "Buddy",
    icon: Users,
    description: "Supportive study companion",
    color: "from-emerald-500 to-teal-600",
    greeting:
      "Hey there! Buddy here, your study companion. Feeling overwhelmed? Let's tackle this together!",
    traits: ["Caring", "Supportive", "Motivational"],
  },
  {
    id: "quest",
    name: "Quest",
    icon: Target,
    description: "Gamified learning guide",
    color: "from-cyan-500 to-blue-600",
    greeting:
      "Ready for an adventure? Quest here to turn your learning into an epic journey! What's our mission?",
    traits: ["Playful", "Adventurous", "Engaging"],
  },
  {
    id: "research",
    name: "Research",
    icon: Search,
    description: "Meticulous fact-finder",
    color: "from-blue-500 to-indigo-600",
    greeting:
      "Hello! Research at your service. Need to dig deep into facts and sources? Let's investigate!",
    traits: ["Precise", "Scholarly", "Informative"],
  },
  {
    id: "sassy",
    name: "Sassy",
    icon: MessageCircle,
    description: "Sarcastic but helpful AI",
    color: "from-pink-500 to-rose-600",
    greeting:
      "Oh look, another student who probably didn't read the assignment. What do you need now?",
    traits: ["Sarcastic", "Witty", "Playful"],
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
  const [, setCurrentTime] = useState(new Date());
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
      <Header />
      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-20">
            <div className="mb-12 relative">
              {/* Simplified hero icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg relative overflow-hidden group transition-all duration-300 hover:scale-105">
                <MessageCircle className="w-10 h-10 text-white z-10 relative" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5"></div>
              </div>

              {/* Cleaner animated rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-28 h-28 border border-slate-200/20 dark:border-slate-700/20 rounded-full animate-spin [animation-duration:25s]"></div>
                <div className="absolute top-1 left-1 w-26 h-26 border border-slate-300/15 dark:border-slate-600/15 rounded-full animate-spin [animation-duration:20s] [animation-direction:reverse]"></div>
              </div>
            </div>

            {/* Better typography with improved line height and spacing */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-8 leading-[1.1] tracking-tight">
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

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
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

          {/* Redesigned personality grid with better card design */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {PERSONALITIES.map((personality) => {
              const IconComponent = personality.icon;
              const isSelected = personality.id === selectedPersonality;

              return (
                <Card
                  key={personality.id}
                  onClick={() => handlePersonalitySelect(personality.id)}
                  className={`group p-6 cursor-pointer transition-all duration-300 border backdrop-blur-xl relative overflow-hidden hover:shadow-lg ${
                    isSelected
                      ? "border-blue-400/40 dark:border-blue-500/40 bg-gradient-to-br from-blue-50/60 via-white/80 to-purple-50/60 dark:from-blue-950/30 dark:via-slate-900/90 dark:to-purple-950/30 shadow-lg ring-2 ring-blue-400/20 dark:ring-blue-500/20"
                      : "border-slate-200/40 dark:border-slate-700/40 bg-white/80 dark:bg-slate-800/80 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:bg-white/90 dark:hover:bg-slate-800/90"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10"></div>
                  )}

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${personality.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl relative overflow-hidden`}
                    >
                      <IconComponent className="w-8 h-8 text-white z-10 relative" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                      {personality.name}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                      {personality.description}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {personality.traits.map((trait, traitIndex) => (
                        <span
                          key={traitIndex}
                          className="px-2.5 py-1 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20 dark:border-slate-600/50"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {isSelected && (
                      <div className="mt-3 w-full">
                        <div
                          className={`w-full h-0.5 bg-gradient-to-r ${personality.color} rounded-full shadow-sm`}
                        ></div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-2 block">
                          ✨ Currently Selected
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
