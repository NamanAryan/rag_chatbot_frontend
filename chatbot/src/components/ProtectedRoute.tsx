
import { Navigate } from "react-router-dom";

import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("user"); 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
