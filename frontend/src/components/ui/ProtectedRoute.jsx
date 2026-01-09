// =============================================================================
// 🟡 NATALIA - Auth Lead
// ProtectedRoute.jsx - Route guard for authenticated routes
// =============================================================================
//
// TODO: Create a wrapper component that protects routes from unauthenticated users
//
// This component wraps around routes that require login.
// If user is NOT logged in, redirect them to /login.
// If user IS logged in, render the children (the protected page).
//
// USAGE IN App.jsx:
// <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//
// LOGIC:
// 1. Get isAuthenticated and isLoading from AuthContext
// 2. If isLoading is true, show a loading spinner (auth check in progress)
// 3. If not authenticated, redirect to /login with state info
// 4. If authenticated, render children
//
// REDIRECT STATE:
// Pass the current location so user can return after login:
// <Navigate to="/login" state={{ from: location, message: '...' }} replace />
//
// Think about:
// - Why show loading state? (Prevents flash of login page on refresh)
// - Why pass location in state? (User returns to where they were going)
// - What does 'replace' do? (Replaces history entry, back button works correctly)
//
// Hint: const { isAuthenticated, isLoading } = useAuth();
// Hint: const location = useLocation();
// Hint: if (isLoading) return <div>Loading...</div>;
// Hint: if (!isAuthenticated) return <Navigate to="/login" state={{...}} replace />;
// Hint: return children;
// =============================================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  // TODO: Get auth state from context
  // const { isAuthenticated, isLoading } = useAuth();
  // const location = useLocation();

  // TODO: Show loading spinner while checking auth
  // if (isLoading) { return loading UI }

  // TODO: Redirect to login if not authenticated
  // Pass { from: location, message: '...' } in state
  // if (!isAuthenticated) { return <Navigate ... /> }

  // TODO: If authenticated, render children
  // return children;
  
  // Your code here
};

export default ProtectedRoute;
