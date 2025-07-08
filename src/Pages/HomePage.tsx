import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Lightbulb, Users, Target, Search, MessageCircle } from 'lucide-react';

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
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPersonality, setSelectedPersonality] = useState("sage");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load saved personality preference
    const savedPersonality = localStorage.getItem("selectedPersonality");
    if (savedPersonality) {
      setSelectedPersonality(savedPersonality);
    }

    // Handle profile image loading when user data changes
    if (user?.picture) {
      const img = new Image();
      img.onload = () => setProfileImageLoaded(true);
      img.onerror = () => setProfileImageLoaded(false);
      img.src = user.picture;
    }
  }, [user]);

  // Handle personality selection
  const handlePersonalitySelect = (personalityId: string) => {
    setSelectedPersonality(personalityId);
    localStorage.setItem("selectedPersonality", personalityId);
    console.log(`Selected personality: ${personalityId}`);
  };

  // Handle logout properly
  const handleLogout = async () => {
    try {
      await logout();
      // Clear personality selection on logout
      localStorage.removeItem("selectedPersonality");
      setSelectedPersonality("sage");
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API fails
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  const handleStartChat = () => {
    // Check authentication before navigating to chat
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Pass selected personality to chat
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

    // Use user from AuthContext instead of userData
    if (user?.picture && profileImageLoaded) {
      return (
        <img
          src={user.picture}
          alt={user.name || "Profile"}
          className={`${size} rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-lg`}
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <div
        className={`${size} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white ${textSize} font-medium shadow-lg`}
      >
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    );
  };

  // Get current personality data
  const currentPersonality =
    PERSONALITIES.find((p) => p.id === selectedPersonality) || PERSONALITIES[0];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                NeuraAI
              </h1>
            </div>
            
            {/* Authentication-aware header */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <ProfileAvatar />
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Show different content based on authentication */}
        {isAuthenticated && user ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="mb-6">
                <ProfileAvatar size="w-20 h-20" textSize="text-2xl" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome back, {user.name}!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Ready to continue your AI conversation?
              </p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>

            {/* Personality Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                Choose Your AI Personality
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PERSONALITIES.map((personality) => (
                  <div
                    key={personality.id}
                    onClick={() => handlePersonalitySelect(personality.id)}
                    className={`p-6 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                      selectedPersonality === personality.id
                        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 shadow-lg'
                        : 'bg-white dark:bg-slate-800 border-2 border-transparent hover:border-blue-300 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <div className="text-4xl mb-4 text-center">
                      <personality.icon />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                      {personality.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                      {personality.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <span className="text-2xl mr-2"><currentPersonality.icon /></span>
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Selected: {currentPersonality.name}
                </span>
              </div>
            </div>

            {/* Start Chat Button */}
            <div className="text-center">
              <button
                onClick={handleStartChat}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Chatting with {currentPersonality.name}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Landing Page for Non-Authenticated Users */}
            <div className="text-center mb-12">
              <div className="mb-8">
                <div className="text-6xl mb-4">🧠</div>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to NeuraAI
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Your intelligent AI companion with multiple personalities. 
                Experience conversations tailored to your needs with document analysis capabilities.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </button>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Multiple Personalities
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose from different AI personalities to match your needs - from wise sage to creative thinker
                </p>
              </div>
              <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Document Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload documents and get intelligent insights with context-aware responses
                </p>
              </div>
              <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Natural Conversations
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Engage in meaningful conversations with full context awareness and memory
                </p>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Why Choose NeuraAI?
              </h3>
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3 p-4">
                  <div className="text-2xl">✨</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Personalized Experience</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Each personality offers unique perspectives and communication styles
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Secure & Private</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Your conversations and documents are protected with enterprise-grade security
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Fast & Reliable</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Powered by cutting-edge AI technology for instant, accurate responses
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Context-Aware</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Remembers conversation history and understands document context
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 NeuraAI. Built with ❤️ for intelligent conversations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
