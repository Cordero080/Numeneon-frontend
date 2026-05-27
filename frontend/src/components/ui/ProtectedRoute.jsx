import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: "Please sign in to access this page",
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
