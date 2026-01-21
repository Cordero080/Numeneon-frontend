/**
 * =============================================================================
 * AUTH CONTEXT - TODO: NATALIA
 * =============================================================================
 * File: frontend/src/contexts/AuthContext.jsx
 * Assigned to: NATALIA
 * Responsibility: Global authentication state management
 * Status: TODO 🟡
 * 
 * REFERENCE: See branch 'pablo-working-backup' for working implementation
 * =============================================================================
 * 
 * WHAT THIS FILE DOES:
 * - Provides authentication state to entire app (user, isAuthenticated, isLoading)
 * - Handles login, signup, logout functions
 * - Checks localStorage for existing tokens on app load
 * - Auto-fetches user info if token exists
 * 
 * =============================================================================
 * IMPLEMENTATION HINTS:
 * =============================================================================
 * 
 * 1. STATE YOU NEED:
 *    - user (object or null) - the logged in user's data
 *    - isLoading (boolean) - true while checking auth on mount
 *    - isAuthenticated (boolean) - true if user is logged in
 * 
 * 2. useEffect ON MOUNT:
 *    - Check if 'accessToken' exists in localStorage
 *    - If yes, call GET /api/auth/me/ to get user info
 *    - If that succeeds, setUser and setIsAuthenticated(true)
 *    - If fails (401), clear tokens from localStorage
 *    - Always setIsLoading(false) at the end
 * 
 * 3. LOGIN FUNCTION:
 *    - POST to /api/auth/login/ with { email, password }
 *    - Response gives { access: "token", refresh: "token" }
 *    - Store both in localStorage as 'accessToken' and 'refreshToken'
 *    - Then GET /api/auth/me/ to get user info
 *    - Return { success: true } or { success: false, error: "message" }
 * 
 * 4. SIGNUP FUNCTION:
 *    - POST to /api/auth/signup/ with { username, email, password }
 *    - On success, auto-login the user (call login function)
 *    - Return { success: true } or { success: false, error: "message" }
 * 
 * 5. LOGOUT FUNCTION:
 *    - Remove 'accessToken' and 'refreshToken' from localStorage
 *    - setUser(null)
 *    - setIsAuthenticated(false)
 * 
 * 6. PROVIDER VALUE:
 *    - Expose: user, isLoading, isAuthenticated, login, signup, logout
 * 
 * =============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // TODO: Add state for user, isLoading, isAuthenticated
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // TODO: useEffect to check auth on mount
  // HINT: Check localStorage for 'accessToken', then call /api/auth/me/
  useEffect(() => {
    const checkAuth = async () => {
      // TODO: Implement auth check
      // 1. Get token from localStorage
      // 2. If token exists, try GET /api/auth/me/
      // 3. If success, setUser and setIsAuthenticated(true)
      // 4. If error, clear localStorage tokens
      // 5. Always setIsLoading(false) at end
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // TODO: Implement login function
  // HINT: POST /api/auth/login/ → store tokens → GET /api/auth/me/
  const login = async (email, password) => {
    // TODO: Implement
    // 1. POST to /api/auth/login/ with { email, password }
    // 2. Store response.data.access as 'accessToken' in localStorage
    // 3. Store response.data.refresh as 'refreshToken' in localStorage
    // 4. GET /api/auth/me/ to fetch user data
    // 5. setUser and setIsAuthenticated(true)
    // 6. Return { success: true } or { success: false, error: message }
    return { success: false, error: 'Not implemented' };
  };

  // TODO: Implement signup function
  // HINT: POST /api/auth/signup/ → then call login()
  const signup = async (username, email, password) => {
    // TODO: Implement
    // 1. POST to /api/auth/signup/ with { username, email, password }
    // 2. On success, call login(email, password) to auto-login
    // 3. Return the result of login
    return { success: false, error: 'Not implemented' };
  };

  // TODO: Implement logout function
  const logout = () => {
    // TODO: Implement
    // 1. localStorage.removeItem('accessToken')
    // 2. localStorage.removeItem('refreshToken')
    // 3. setUser(null)
    // 4. setIsAuthenticated(false)
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
