import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  LogOut,
  MessageCircle,
  Plus,
  Sparkles,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function AIChatbotHomepage() {
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([
    {
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      title: "Getting Started",
      lastMessage: "Hello! I'm your AI assistant...",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      title: "Project Planning",
      lastMessage: "Let me help you plan your project...",
      timestamp: "Yesterday",
    },
    {
      id: 3,
      title: "Code Review",
      lastMessage: "I can help review your code...",
      timestamp: "2 days ago",
    },
  ]);
  const [activeChatId, setActiveChatId] = useState(1);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const animateTyping = (text: string) => {
    const words = text.split(" ");
    let currentWordIndex = 0;
    setTypingText("");

    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        setTypingText((prev) => {
          const newText = prev + (prev ? " " : "") + words[currentWordIndex];
          return newText;
        });
        currentWordIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setTypingText("");
        setMessages((prev) => [...prev, { text, isUser: false }]);
      }
    }, 100 + Math.random() * 100);
  };

  const TypingIndicator = () => (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg">
        {typingText ? (
          <p className="text-sm leading-relaxed">
            {typingText}
            <span className="inline-block w-2 h-4 bg-slate-400 ml-1 animate-pulse"></span>
          </p>
        ) : (
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = inputValue;

    // Add user message
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInputValue("");

    // ✅ Show typing indicator
    setIsTyping(true);

    try {
      // Call your backend API
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ question: userMessage }),
      });

      // ✅ Simulate thinking delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.ok) {
        const data = await response.json();
        // ✅ Start word-by-word animation
        animateTyping(data.answer);
      } else {
        animateTyping("Sorry, I encountered an error. Please try again.");
      }
    } catch (error) {
      setIsTyping(false);
      setTypingText("");
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting. Please try again.",
          isUser: false,
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout endpoint not available");
    }

    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleNewChat = () => {
    const newChatId = chatHistory.length + 1;
    setChatHistory((prev) => [
      {
        id: newChatId,
        title: `New Chat ${newChatId}`,
        lastMessage: "Hello! I'm your AI assistant...",
        timestamp: "Just now",
      },
      ...prev,
    ]);
    setActiveChatId(newChatId);
    setMessages([
      {
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
      },
    ]);
  };

  // ✅ Delete chat function
  const handleDeleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));

    // If deleting active chat, switch to another one
    if (chatId === activeChatId) {
      const remainingChats = chatHistory.filter((chat) => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id);
      } else {
        // Create a new chat if no chats left
        handleNewChat();
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* User Profile */}
          <div className="flex items-center gap-3">
            {userData?.picture ? (
              <img
                src={userData.picture || "/avatar"}
                alt={userData.name || "Profile"}
                className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm"
                referrerPolicy="no-referrer" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {userData?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              {userData?.name || "User"}
            </span>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-colors border-slate-200 dark:border-slate-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Enhanced Sidebar with delete buttons */}
          <div
            className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
              isSidebarOpen
                ? "w-80 opacity-100"
                : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
              {/* Header with New Chat and Collapse buttons */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <Button
                    onClick={handleNewChat}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Chat
                  </Button>

                  {/* Collapse button beside New Chat */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSidebar}
                    className="px-3 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600"
                    title="Collapse sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
                  Chat History
                </h3>
                <div className="space-y-2">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`group p-3 rounded-lg cursor-pointer transition-colors relative ${
                        activeChatId === chat.id
                          ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 pr-8">
                          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                            {chat.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                            {chat.lastMessage}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {chat.timestamp}
                          </p>
                        </div>

                        {/* Delete button - appears on hover */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="flex-1 transition-all duration-300 ease-in-out">
            <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg flex flex-col">
              {/* Chat Header with expand button when sidebar is closed */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                {!isSidebarOpen && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSidebar}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      title="Open sidebar"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                  </>
                )}

                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {chatHistory.find((chat) => chat.id === activeChatId)
                    ?.title || "Chat"}
                </h2>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
                        message.isUser
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-sm"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>

                    {message.isUser && (
                      <div className="w-8 h-8 flex-shrink-0">
                        {userData?.picture ? (
                          <img
                            src={userData.picture}
                            alt="You"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Enhanced Typing Indicator */}
                {isTyping && <TypingIndicator />}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message here... (Press Enter to send)"
                      className="resize-none border-slate-200 dark:border-slate-600 focus:border-blue-300 dark:focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      disabled={isTyping}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === "" || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 disabled:opacity-50"
                  >
                    {isTyping ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
