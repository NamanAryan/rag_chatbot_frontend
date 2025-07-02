import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBot from "./Pages/ChatBot";
import AuthRedirect from "./Pages/AuthRedirect";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import About from "./Pages/About";
import Features from "./Pages/Features";
import Contact from "./Pages/Contact";

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
