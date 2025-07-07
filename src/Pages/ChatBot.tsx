import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Card } from "@/components/card";
import PortalDropdown from "@/components/PortalDropdown";
import {
  LogOut,
  Plus,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ChevronDown,
  GraduationCap,
  Lightbulb,
  Search,
  Target,
  Users,
  Annoyed,
} from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useLocation } from "react-router-dom";

interface ChatHistoryItem {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
  session_id: string;
}

const PERSONALITIES = {
  scholar: {
    name: "Scholar",
    icon: GraduationCap,
    color: "from-indigo-500 to-purple-600",
    greeting:
      "Greetings, fellow learner! Scholar here to help you master any subject. What knowledge shall we explore?",
    systemPrompt:
      "You are Scholar, a dedicated academic mentor. Provide thorough explanations, break down complex topics, and guide students through difficult concepts with patience and clarity.",
    shortDescription: "Academic mentor, thorough explanations",
  },
  blaze: {
    name: "Blaze",
    icon: Lightbulb,
    color: "from-orange-500 to-red-600",
    greeting:
      "What's up! Blaze here, ready to ignite your creativity! Got any cool projects we can brainstorm?",
    systemPrompt:
      "You are Blaze, an innovative project catalyst. Be energetic, think outside the box, and help students create amazing presentations, essays, and creative assignments.",
    shortDescription: "Creative catalyst, innovative projects",
  },
  buddy: {
    name: "Buddy",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    greeting:
      "Hey there! Buddy here, your study companion. Feeling overwhelmed? Let's tackle this together!",
    systemPrompt:
      "You are Buddy, a caring study companion. Offer emotional support, motivation, and encouragement. Help students manage stress and stay positive about their academic journey.",
    shortDescription: "Caring companion, emotional support",
  },
  quest: {
    name: "Quest",
    icon: Target,
    color: "from-cyan-500 to-blue-600",
    greeting:
      "Ready for an adventure? Quest here to turn your learning into an epic journey! What's our mission?",
    systemPrompt:
      "You are Quest, a gamified learning guide. Use adventure and gaming metaphors, create challenges, and make studying feel like completing quests and earning achievements.",
    shortDescription: "Gamified guide, adventure learning",
  },
  research: {
    name: "Research",
    icon: Search,
    color: "from-blue-500 to-indigo-600",
    greeting:
      "Hello! Research at your service. Need to dig deep into facts and sources? Let's investigate!",
    systemPrompt:
      "You are Research, a meticulous fact-finder. Help students with citations, source evaluation, and detailed information gathering. Be precise and thorough in academic research.",
    shortDescription: "Fact-finder, citation helper",
  },
  SaltyGPT : {
    name: "SaltyGPT ",
    icon: Annoyed,
    color: "from-pink-500 to-rose-600",
    greeting:
      "Oh look, another student who probably didn't read the assignment. What do you need now?",
    systemPrompt:
      "You are SaltyGPT , a sarcastic but ultimately helpful AI. Answer questions with wit, sarcasm, and playful teasing, but always provide the correct information underneath the sass.",
    shortDescription: "Sarcastic wit, playful teasing",
  },
};

export default function AIChatbotHomepage() {
  const location = useLocation();
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [activeChatId, setActiveChatId] = useState(1);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [isFileUploading, setIsFileUploading] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showUploadAlert, setShowUploadAlert] = useState(false);
  const [alertTimeoutId, setAlertTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );
  const [input, setInput] = useState("");
  const [selectedPersonality, setSelectedPersonality] = useState(() => {
    const fromNavigation = location.state?.selectedPersonality;
    const fromStorage = localStorage.getItem("selectedPersonality");
    return fromNavigation || fromStorage || "sage";
  });

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        setShouldAutoScroll(isAtBottom);
      }, 100);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log(file.name, file.size);
    if (!file) return;
    if (alertTimeoutId) {
      clearTimeout(alertTimeoutId);
    }

    let sessionId = currentSessionId;
    if (!sessionId || sessionId === "null") {
      sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);
    }
    console.log("📍 Using session ID:", sessionId);

    setUploadStatus("uploading");
    setShowUploadAlert(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", sessionId!);
      formData.append("personality", selectedPersonality);

      const response = await fetch(`${BACKEND_URL}/upload-file`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("success");
        setHasUploadedFile(true);
        setUploadedFileName(file.name);

        const timeoutId = setTimeout(() => {
          setShowUploadAlert(false);
        }, 5000);
        setAlertTimeoutId(timeoutId);
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      setUploadStatus("fail");
      const timeoutId = setTimeout(() => {
        setShowUploadAlert(false);
      }, 500);
      setAlertTimeoutId(timeoutId);
      setMessages((prev) => [
        ...prev,
        {
          text: "❌ Sorry, there was an error uploading your file. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setSelectedFile(null);
    }
  };

  const currentPersonality =
    PERSONALITIES[selectedPersonality as keyof typeof PERSONALITIES] ||
    PERSONALITIES.scholar;
  const PersonalityIcon = currentPersonality.icon;

  // Initialize with personality greeting
  useEffect(() => {
    setMessages([
      {
        text: currentPersonality.greeting,
        isUser: false,
      },
    ]);
  }, [selectedPersonality]);

  const loadUserSessions = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch(
        `${BACKEND_URL}/chat/sessions?personality=${selectedPersonality}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedSessions: ChatHistoryItem[] = data.sessions.map(
          (session: any, index: number) => ({
            id: index + 1,
            title: session.title,
            lastMessage: session.title,
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
  }, [selectedPersonality]);

  const animateTyping = (text: string) => {
    const words = text.split(" ");
    let currentWordIndex = 0;
    setTypingText("");

    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        setTypingText((prev) => {
          const newText = prev + (prev ? " " : "") + words[currentWordIndex];

          // Only scroll every 5 words if auto-scroll is enabled, and don't force it
          if (
            shouldAutoScroll &&
            currentWordIndex % 5 === 0 &&
            messagesEndRef.current
          ) {
            messagesEndRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }

          return newText;
        });
        currentWordIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setTypingText("");
        setMessages((prev) => [...prev, { text, isUser: false }]);
        if (shouldAutoScroll && messagesEndRef.current) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }, 100);
        }
      }
    }, 50);
  };

  const TypingIndicator = () => (
    <div className="flex gap-3 justify-start">
      <div
        className={`w-8 h-8 bg-gradient-to-br ${currentPersonality.color} rounded-full flex items-center justify-center flex-shrink-0`}
      >
        <PersonalityIcon className="w-4 h-4 text-white" />
      </div>
      <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg">
        {typingText ? (
          <p className="text-sm leading-relaxed">
            {typingText}
            <span className="inline-block w-2 h-4 bg-slate-400 dark:bg-slate-500 ml-1 animate-pulse"></span>
          </p>
        ) : (
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const handleSendMessage = async () => {
    if (input.trim() === "" || isTyping) return;

    const userMessage = input.trim();

    // Generate session ID if needed
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);
    }

    // Add user message only once
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInput("");
    setIsTyping(true);

    // Refocus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    try {
      console.log("Sending has_file:", hasUploadedFile);
      const response = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question: userMessage,
          session_id: sessionId,
          personality: selectedPersonality,
          system_prompt: currentPersonality.systemPrompt,
          has_file: hasUploadedFile,
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

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/logout`, {
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
        lastMessage: currentPersonality.greeting,
        timestamp: "Just now",
        session_id: newSessionId,
      },
      ...prev,
    ]);

    setActiveChatId(newChatId);
    setCurrentSessionId(newSessionId);
    setMessages([
      {
        text: currentPersonality.greeting,
        isUser: false,
      },
    ]);
  };

  const UploadStatusIndicator = ({ status }: { status: string }) => {
    if (!showUploadAlert) return null;

    const getStatusConfig = () => {
      switch (status) {
        case "success":
          return {
            icon: "✓",
            text: "File uploaded successfully",
            bgColor: "bg-green-500",
            textColor: "text-white",
          };
        case "fail":
          return {
            icon: "✗",
            text: "Upload failed",
            bgColor: "bg-red-500",
            textColor: "text-white",
          };
        case "uploading":
          return {
            icon: "⟳",
            text: "Processing file...",
            bgColor: "bg-blue-500",
            textColor: "text-white",
          };
        default:
          return null;
      }
    };

    const config = getStatusConfig();
    if (!config) return null;
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/chat/history?session_id=${sessionId}&personality=${selectedPersonality}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load chat history");
      }

      const data = await response.json();
      const formattedMessages = data.messages.map((msg: any) => ({
        text: msg.message,
        isUser: msg.is_user,
      }));

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
              text: currentPersonality.greeting,
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

    const confirmed = window.confirm(
      "Are you sure you want to delete this chat? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const chatToDelete = chatHistory.find((chat) => chat.id === chatId);
      if (!chatToDelete) return;

      const originalTitle = chatToDelete.title;
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: "Deleting..." } : chat
        )
      );

      const response = await fetch(
        `${BACKEND_URL}/chat/delete/${chatToDelete.session_id}?personality=${selectedPersonality}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, title: originalTitle } : chat
          )
        );
        throw new Error("Failed to delete chat from server");
      }

      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));

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

  // Personality Dropdown Component
  const PersonalityDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [, setDropdownPosition] = useState<"left" | "right">(
      "right"
    );

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      return () => {
        if (alertTimeoutId) {
          clearTimeout(alertTimeoutId);
        }
      };
    }, [alertTimeoutId]);

    useEffect(() => {
      if (isOpen && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        if (rect.left + 280 > viewportWidth - 20) {
          setDropdownPosition("left");
        } else {
          setDropdownPosition("right");
        }
      }
    }, [isOpen]);

    const handlePersonalityChange = (personalityId: string) => {
      setSelectedPersonality(personalityId);
      localStorage.setItem("selectedPersonality", personalityId);
      setIsOpen(false);

      setMessages([
        {
          text: PERSONALITIES[personalityId as keyof typeof PERSONALITIES]
            .greeting,
          isUser: false,
        },
      ]);

      setCurrentSessionId(null);
      setActiveChatId(0);
      loadUserSessions();
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
        {/* Enhanced Header with Personality */}
        <UploadStatusIndicator status={uploadStatus} />
        <header className="flex items-center justify-between p-6 border-b bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              <div
                className={`w-8 h-8 bg-gradient-to-br ${currentPersonality.color} rounded-lg flex items-center justify-center`}
              >
                <PersonalityIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                  {currentPersonality.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  NeruraChat
                </p>
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-slate-800/60 rounded-full border border-white/20 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all"
              >
                <div
                  className={`w-6 h-6 bg-gradient-to-br ${currentPersonality.color} rounded-full flex items-center justify-center`}
                >
                  <PersonalityIcon className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {currentPersonality.name}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <PortalDropdown>
                  <div className="ml-40 fixed top-[64px] left-0 z-[9999] w-80 max-h-[90vh] overflow-y-auto bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg px-4 py-4">
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
                      Switch Personality
                    </div>

                    <div className="flex flex-col gap-3">
                      {Object.entries(PERSONALITIES).map(
                        ([id, personality]) => {
                          const Icon = personality.icon;
                          const isSelected = id === selectedPersonality;

                          return (
                            <button
                              key={id}
                              onClick={() => handlePersonalityChange(id)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm text-left ${
                                isSelected
                                  ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-300 dark:ring-blue-700"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-[1.02]"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full bg-gradient-to-br ${personality.color} flex items-center justify-center flex-shrink-0`}
                              >
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex flex-col truncate">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                                  {personality.name}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {personality.shortDescription}
                                </span>
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </PortalDropdown>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DarkModeToggle />

            <div className="flex items-center gap-3">
              {userData?.picture ? (
                <img
                  src={userData.picture}
                  alt={userData.name || "Profile"}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm"
                  referrerPolicy="no-referrer"
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
        <div className="container mx-auto px-6 py-8 max-w-7xl z-10">
          <div className="flex gap-6 h-[calc(100vh-200px)] z-10">
            {/* Enhanced Sidebar */}
            <div
              className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
                isSidebarOpen
                  ? "w-80 opacity-100"
                  : "w-0 opacity-0 overflow-hidden"
              }`}
            >
              <Card className="relative z-0 h-full bg-white dark:bg-slate-800 border-0 shadow-lg flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleNewChat}
                      className={`flex-1 bg-gradient-to-r ${currentPersonality.color} hover:opacity-90 text-white`}
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

                <div className="flex-1 flex flex-col min-h-0 p-4 ">
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 flex-shrink-0">
                    Chat History
                  </h3>

                  {isLoadingHistory ? (
                    <div className="space-y-2 relative z-10">
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
                          className={`group p-3 rounded-lg cursor-pointer transition-colors flex-shrink-0 relative z-10 ${
                            activeChatId === chat.id
                              ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                              : "hover:bg-slate-50 dark:hover:bg-slate-700"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Annoyed className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
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
            <div className="flex-1 transition-all duration-300 ease-in-out scale-z-10">
              <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg flex flex-col">
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
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!message.isUser && (
                        <div
                          className={`w-8 h-8 bg-gradient-to-br ${currentPersonality.color} rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          <PersonalityIcon className="w-4 h-4 text-white" />
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
                          {message.text || "No content"}
                        </p>
                      </div>

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

                  {isTyping && <TypingIndicator />}
                  <div
                    ref={messagesEndRef}
                    style={{ height: "1px", overflowAnchor: "auto" }}
                  />
                </div>

                <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                  {/* ✅ File Selection Preview */}
                  {selectedFile && (
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            🔗 {selectedFile.name}
                          </span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleFileUpload(selectedFile)}
                            disabled={uploadStatus === "uploading"}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {uploadStatus === "uploading"
                              ? "Uploading..."
                              : "Upload"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedFile(null);
                              setUploadStatus("initial");
                            }}
                            className="text-slate-600 dark:text-slate-400"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (
                            e.key === "Enter" &&
                            input.trim() !== "" &&
                            !isTyping
                          ) {
                            // Added validation
                            handleSendMessage();
                          }
                        }}
                        disabled={isTyping}
                        className="flex-1"
                        autoFocus
                      />
                    </div>
                    {/* Add this persistent file indicator in your header area or near the input */}
                    {hasUploadedFile && uploadStatus === "success" && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700">
                        <span className="text-green-600 dark:text-green-400 text-xs">
                          ✓
                        </span>
                        <span className="text-xs text-green-700 dark:text-green-300 truncate max-w-[100px]">
                          {uploadedFileName}
                        </span>
                      </div>
                    )}
                    {/* ✅ File Upload Button */}
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setUploadStatus("initial");
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      disabled={isTyping || uploadStatus === "uploading"}
                      className="px-3 border-slate-200 dark:border-slate-600"
                      title="Upload document"
                    >
                      🔗
                    </Button>

                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        input.trim() === "" ||
                        isTyping ||
                        uploadStatus === "uploading"
                      }
                      className={`bg-gradient-to-r ${currentPersonality.color} hover:opacity-90 text-white px-6 disabled:opacity-50`}
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
  };
  return <PersonalityDropdown />;
}
