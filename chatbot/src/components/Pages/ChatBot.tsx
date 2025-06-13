interface ChatHistoryItem {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
  session_id: string;
}

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
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [activeChatId, setActiveChatId] = useState(1);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const loadUserSessions = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch("http://localhost:8000/chat/sessions", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        // Convert backend format to frontend format
        const formattedSessions: ChatHistoryItem[] = data.sessions.map(
          (session: any, index: number) => ({
            id: index + 1,
            title: session.title,
            lastMessage: session.title, // Using title as last message
            timestamp: new Date(session.timestamp).toLocaleDateString(),
            session_id: session.session_id,
          })
        );

        setChatHistory(formattedSessions);
      }
    } catch (error) {
      console.error("Failed to load user sessions:", error);
      setChatHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };
  useEffect(() => {
    loadUserSessions();
  }, []);

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

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);
    }

    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question: userMessage,
          session_id: sessionId,
        }),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.ok) {
        const data = await response.json();
        animateTyping(data.answer);
        await loadUserSessions();
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
    const newSessionId = crypto.randomUUID();
    const newChatId = chatHistory.length + 1;

    setChatHistory((prev) => [
      {
        id: newChatId,
        title: `New Chat ${newChatId}`,
        lastMessage: "Hello! I'm your AI assistant...",
        timestamp: "Just now",
        session_id: newSessionId, // ✅ Store the session_id
      },
      ...prev,
    ]);

    setActiveChatId(newChatId);
    setCurrentSessionId(newSessionId);
    setMessages([
      {
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
      },
    ]);
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/chat/history?session_id=${sessionId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load chat history");
      }

      const data = await response.json();
      console.log("Raw Supabase data:", data.messages);

      const formattedMessages = data.messages.map((msg: any) => ({
        text: msg.message,
        isUser: msg.is_user,
      }));

      console.log("Formatted messages:", formattedMessages);
      return formattedMessages;
    } catch (error) {
      console.error("Error loading chat history:", error);
      return [];
    }
  };

  const handleChatSelect = async (chatId: number) => {
    setActiveChatId(chatId);

    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (selectedChat && selectedChat.session_id) {
      try {
        const historyMessages = await loadChatHistory(selectedChat.session_id);
        if (historyMessages.length > 0) {
          setMessages(historyMessages);
        } else {
          setMessages([
            {
              text: "Hello! I'm your AI assistant. How can I help you today?",
              isUser: false,
            },
          ]);
        }

        setCurrentSessionId(selectedChat.session_id);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }
  };

  const handleDeleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    // Add confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const chatToDelete = chatHistory.find((chat) => chat.id === chatId);
      if (!chatToDelete) return;

      // Show loading state (optional)
      const originalTitle = chatToDelete.title;
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: "Deleting..." } : chat
        )
      );

      const response = await fetch(
        `http://localhost:8000/chat/delete/${chatToDelete.session_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        // Restore original title if deletion fails
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, title: originalTitle } : chat
          )
        );
        throw new Error("Failed to delete chat from server");
      }

      // Remove from local state
      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));

      // Handle active chat switching
      if (chatId === activeChatId) {
        const remainingChats = chatHistory.filter((chat) => chat.id !== chatId);
        if (remainingChats.length > 0) {
          await handleChatSelect(remainingChats[0].id);
        } else {
          handleNewChat();
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Failed to delete chat. Please try again.");
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
          {/* Enhanced Sidebar with fixed height */}
          <div
            className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
              isSidebarOpen
                ? "w-80 opacity-100"
                : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg flex flex-col">
              {/* Header with New Chat and Collapse buttons - Fixed height */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div className="flex gap-2">
                  <Button
                    onClick={handleNewChat}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Chat
                  </Button>

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

              {/* Chat History - Scrollable area with flex-1 */}
              <div className="flex-1 flex flex-col min-h-0 p-4">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 flex-shrink-0">
                  Chat History
                </h3>

                {isLoadingHistory ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse"
                      >
                        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
                    No chat history yet. Start a conversation!
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-0">
                    {chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat.id)}
                        className={`group p-3 rounded-lg cursor-pointer transition-colors relative flex-shrink-0 ${
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
                )}
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
                    {/* AI Avatar - only show for AI messages */}
                    {!message.isUser && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Message Bubble with proper styling */}
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
                        message.isUser
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-sm" // ✅ User messages: blue gradient
                          : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm" // ✅ AI messages: grey with dark mode
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text || "No content"}{" "}
                        {/* ✅ Add fallback text */}
                      </p>
                    </div>

                    {/* User Avatar - only show for user messages */}
                    {message.isUser && (
                      <div className="w-8 h-8 flex-shrink-0">
                        {userData?.picture ? (
                          <img
                            src={userData.picture}
                            alt="You"
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
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
