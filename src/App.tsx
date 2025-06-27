// App.jsx or App.js
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
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/google" element={<AuthRedirect />} />
          {/* Redirect root path to home */}
          <Route path="/" element={<HomePage />} />
          {/* Redirect any unknown paths to home */}
          <Route path="*" element={<HomePage />} />
          {/* Redirect root path to login if not authenticated */}
          <Route
            path="/login"
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* Protected route */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}
