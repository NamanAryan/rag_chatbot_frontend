import { Link } from "react-router-dom";
import {
  Sparkles,
  Brain,
  GraduationCap,
  Flame,
  Users,
  Target,
  Search,
  MessageCircle,
} from "lucide-react";

const Footer = ({
  PERSONALITIES = [],
  handlePersonalitySelect = (_id?: string) => {},
}) => {
  const defaultPersonalities = [
    {
      id: "scholar",
      name: "Scholar",
      icon: GraduationCap,
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "blaze",
      name: "Blaze",
      icon: Flame,
      color: "from-orange-500 to-red-600",
    },
    {
      id: "buddy",
      name: "Buddy",
      icon: Users,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "quest",
      name: "Quest",
      icon: Target,
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "research",
      name: "Research",
      icon: Search,
      color: "from-indigo-500 to-purple-600",
    },
    {
      id: "sassy",
      name: "Sassy",
      icon: MessageCircle,
      color: "from-pink-500 to-rose-600",
    },
  ];

  const personalities =
    PERSONALITIES.length > 0 ? PERSONALITIES : defaultPersonalities;

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/features", label: "Features" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  const supportLinks = [
    { path: "/contact", label: "Help Center" },
    { path: "/#", label: "Privacy Policy" },
    { path: "/#", label: "Terms of Service" },
    { path: "/contact", label: "Send Feedback" },
  ];

  return (
    <footer className="relative mt-20 border-t border-slate-200/20 dark:border-slate-700/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/3 via-purple-600/3 to-indigo-600/3 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-indigo-500/5"></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand section */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-4 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                    NeuraChat
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    AI Personality Hub
                  </p>
                </div>
              </Link>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md leading-relaxed">
                Experience conversations with six unique AI personalities, each
                designed to help you in different ways. From academic mentoring
                to creative innovation and supportive companionship.
              </p>
              <div className="flex items-center gap-4"></div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Support
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Personality showcase */}
          <div className="mb-8 p-6 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/50 backdrop-blur-sm">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">
              Meet Our AI Personalities
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              {personalities.map((personality) => {
                const IconComponent = personality.icon;
                return (
                  <button
                    key={personality.id}
                    onClick={() => handlePersonalitySelect(personality.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-slate-700/60 rounded-full backdrop-blur-sm border border-white/20 dark:border-slate-600/50 hover:scale-105 transition-transform cursor-pointer group"
                  >
                    <div
                      className={`w-6 h-6 bg-gradient-to-br ${personality.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {personality.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200/20 dark:border-slate-700/20">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © 2025 NeuraChat. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50">
                <Brain className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Powered by Gemini
                </span>
              </div>

              <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                v2.1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
