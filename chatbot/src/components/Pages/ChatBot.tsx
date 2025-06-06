import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut } from "lucide-react";

export default function AIChatbotHomepage() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    setInputValue('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: `I received your message: "${inputValue}". This is a simulated response.`, 
        isUser: false 
      }]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    // In a real app, this would call an auth service
    alert("Logging out...");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with logout button */}
      <header className="flex justify-between items-center p-4 border-b bg-white">
        <h1 className="text-xl font-bold text-gray-800">AI Chat Assistant</h1>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${message.isUser 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'}`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}