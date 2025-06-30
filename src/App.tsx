import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Pages/HomePage";
import Login from "./components/Pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBot from "./components/Pages/ChatBot";
import AuthRedirect from "./components/Pages/AuthRedirect";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import About from './components/Pages/About';
import Features from './components/Pages/Features';
import Contact from './components/Pages/Contact';

export default function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          
          {/* OAuth callback route */}
          <Route path="/google" element={<AuthRedirect />} />
          
          {/* Protected routes */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            }
          />
          
          {/* Catch-all route - must be last */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}
