import { LogIn, LogOut, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800">AI Assistant</h1>
        </div>

        {isAuthenticated ? (
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleLogin}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        )}
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
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Welcome to Your AI Assistant
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start a conversation and let our AI help you with anything you
              need. Ask questions, get creative, or just have a chat.
            </p>
          </div>

          {/* Chat Preview */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <div className="space-y-4">
                {/* Sample Messages */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="text-slate-700">
                      Hello! I'm your AI assistant. How can I help you today?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                    <p>Can you help me brainstorm some ideas?</p>
                  </div>
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-slate-600">
                      You
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                    <p className="text-slate-700">
                      Absolutely! I'd love to help you brainstorm. What topic or
                      area are you looking to explore?
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Input Preview */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex gap-3 items-center">
                  <div className="flex-1 bg-slate-50 rounded-full px-4 py-3 text-slate-500">
                    Type your message here...
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 text-center bg-white/50 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Natural Conversations
              </h3>
              <p className="text-slate-600 text-sm">
                Chat naturally and get intelligent responses tailored to your
                needs.
              </p>
            </Card>

            <Card className="p-6 text-center bg-white/50 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Creative Solutions
              </h3>
              <p className="text-slate-600 text-sm">
                Get creative ideas and innovative solutions to your challenges.
              </p>
            </Card>

            <Card className="p-6 text-center bg-white/50 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Always Available
              </h3>
              <p className="text-slate-600 text-sm">
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
