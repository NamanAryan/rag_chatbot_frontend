// pages/Features.jsx
import Layout from './Layout';
import { Brain, MessageCircle, Palette, Briefcase, Heart, Lightbulb, Shield, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Six Unique Personalities",
      description: "Choose from Creative, Professional, Friendly, Analytical, Supportive, and Innovative AI personalities.",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: MessageCircle,
      title: "Natural Conversations",
      description: "Experience fluid, context-aware conversations that feel genuinely human.",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description: "Get immediate, thoughtful responses tailored to your chosen personality.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your conversations are secure and private, with end-to-end encryption.",
      color: "from-red-500 to-pink-600"
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-6">
            Powerful Features
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Discover what makes NeuraChat the perfect AI companion for every conversation
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Personality Showcase */}
        <div className="p-8 bg-gradient-to-br from-blue-50/60 via-white/80 to-purple-50/60 dark:from-blue-950/30 dark:via-slate-900/90 dark:to-purple-950/30 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 text-center">
            Meet Your AI Personalities
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Palette className="w-12 h-12 text-pink-500 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Creative</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Perfect for brainstorming and artistic projects</p>
            </div>
            <div className="text-center">
              <Briefcase className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Professional</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Ideal for business and formal communications</p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Supportive</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Great for encouragement and emotional support</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Features;
