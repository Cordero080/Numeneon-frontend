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

import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@services/apiClient";
import authService from "@services/authService";

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
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          // Use service to see if the existing token is still valid
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // if the token is invalid/expired, clear it out
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setIsLoading(false); // Auth check complete
    };
    checkAuth();
  }, []);

  // TODO: Implement login function
  // HINT: POST /api/auth/login/ → store tokens → GET /api/auth/me/
  const login = async (email, password) => {
    try {
      // call service to handle API call and token storage
      await authService.login(email, password);
      // call service to get the full user object
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Invalid credentials",
      };
    }
  };

  // TODO: Implement signup function
  // HINT: POST /api/auth/signup/ → then call login()
  const signup = async (username, email, password) => {
    try {
      await authService.signup(username, email, password);
      // user signed up successfully, now use the login function to log them in
      return await login(email, password);
    } catch (error) {
      return { success: false, error: error.response?.data || "Signup failed" };
    }
  };
  // TODO: Implement logout function
  const logout = () => {
    authService.logout(); // clear tokens from localStorage
    setUser(null); // clear user state
    setIsAuthenticated(false);
    window.location.href = "/login"; // force redirect to login page - clean state
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
