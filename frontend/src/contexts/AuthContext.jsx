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

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // TODO: Set up state
  // const [user, setUser] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // TODO: Check for existing auth on mount
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = localStorage.getItem('accessToken');
  //     if (token) {
  //       try {
  //         const response = await apiClient.get('/auth/me/');
  //         setUser(response.data);
  //         setIsAuthenticated(true);
  //       } catch (error) {
  //         // Token invalid - clear it
  //         localStorage.removeItem('accessToken');
  //         localStorage.removeItem('refreshToken');
  //       }
  //     }
  //     setIsLoading(false);
  //   };
  //   checkAuth();
  // }, []);

  // TODO: Implement login function
  // const login = async (email, password) => {
  //   try {
  //     const response = await apiClient.post('/auth/login/', { email, password });
  //     localStorage.setItem('accessToken', response.data.access);
  //     localStorage.setItem('refreshToken', response.data.refresh);
  //     const userResponse = await apiClient.get('/auth/me/');
  //     setUser(userResponse.data);
  //     setIsAuthenticated(true);
  //     return { success: true };
  //   } catch (error) {
  //     return { success: false, error: error.response?.data?.detail || 'Login failed' };
  //   }
  // };

  // TODO: Implement signup function
  // const signup = async (username, email, password) => { ... };

  // TODO: Implement logout function
  // const logout = () => { ... };

  // TODO: Implement updateProfile function
  // const updateProfile = async (profileData) => { ... };

  // TODO: Return provider with all values and functions
  // Your code here
};

export const useAuth = () => {
  // TODO: Return useContext(AuthContext) with error check
  // Your code here
};

export default AuthContext;
