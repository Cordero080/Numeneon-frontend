/**
 * ProtectedRoute - Route guard for authenticated pages
 * 
 * Wraps routes that require login. Redirects to /login if not authenticated,
 * passing the attempted URL so users return to their destination after login.
 * 
 * Usage: <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show spinner while checking auth status (prevents flash of login page)
  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Redirect to login, saving current location for post-login redirect
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location, message: 'Please sign in to access this page' }} 
        replace 
      />
    );
  }

  // User is authenticated - render the protected content
  return children;
};

export default ProtectedRoute;
