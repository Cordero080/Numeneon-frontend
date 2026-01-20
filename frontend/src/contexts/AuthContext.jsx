// =============================================================================
// 🟡 NATALIA - Auth Lead
// AuthContext.jsx - Global authentication state management
// =============================================================================
//
// TODO: Create a context that manages user authentication
//
// This is the FOUNDATION of the app - without auth, nothing works!
// Every protected feature checks this context to see if user is logged in.
//
// STATE:
// - user: Object with user data (or null if not logged in)
// - isLoading: Boolean, true while checking auth status
// - isAuthenticated: Boolean, true if user is logged in
//
// FUNCTIONS TO PROVIDE:
// - login(email, password): Authenticate user, store JWT, fetch user data
// - signup(username, email, password): Create account, then auto-login
// - logout(): Clear tokens and user state
// - updateProfile(profileData): Update user's profile info
//
// ON MOUNT:
// - Check localStorage for existing accessToken
// - If token exists, call /api/auth/me/ to get user data
// - If token is invalid/expired, clear it
//
// JWT STORAGE:
// - accessToken: Short-lived, used for API calls
// - refreshToken: Long-lived, used to get new access tokens
// - Both stored in localStorage
//
// API ENDPOINTS:
// - POST /api/auth/login/ → { email, password } → { access, refresh }
// - POST /api/auth/signup/ → { username, email, password }
// - GET /api/auth/me/ → Returns current user data
// - PUT /api/auth/profile/:id/ → Update profile
//
// Think about:
// - Why check auth on mount? (User refreshes page)
// - Why use isLoading? (Prevent flash of login page)
// - What should happen if token refresh fails?
//
// Hint: useEffect with empty deps [] runs once on mount
// Hint: After login, fetch /api/auth/me/ to get full user object
// Hint: Always return { success, error } from async functions
// =============================================================================

import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@services/apiClient";
import authService from "@services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // TODO: Set up state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // TODO: Check for existing auth on mount (if user is already logged in ex page refresh)
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

  // TODO: Implement updateProfile function
  const updateProfile = async (profileData) => {
    try {
      // tell the backend to update database
      const updatedUser = await authService.updateProfile(user.id, profileData);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data || "Update failed" };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render the app until we know if the user is logged in or not */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // TODO: Return useContext(AuthContext) with error check
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
