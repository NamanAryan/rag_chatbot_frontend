// App.jsx or App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Pages/HomePage";
import Login from "./components/Pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBot from "./components/Pages/ChatBot";
import AuthRedirect from "./components/Pages/AuthRedirect";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/google" element={<AuthRedirect />} />
        {/* Redirect root path to home */}
        <Route
          path="/"
          element={<Home />}
        />
        {/* Redirect any unknown paths to home */}
        <Route
          path="*"
          element={<Home />}
        />
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
  );
}
