import Layout from './Layout';
import { Users, Target, Award } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-6">
            About NeuraChat
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Revolutionizing conversations through AI-powered personalities
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg">
            <Target className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Our Mission</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To make AI conversations more human, engaging, and tailored to individual needs through distinct personality-driven interactions.
            </p>
          </div>

          <div className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg">
            <Award className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Our Vision</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To create a world where AI assistants understand context, emotion, and individual preferences to provide truly personalized experiences.
            </p>
          </div>
        </div>       
      </div>
    </Layout>
  );
};

export default About;
