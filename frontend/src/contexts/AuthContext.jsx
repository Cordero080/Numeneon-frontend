/**
 * =============================================================================
 * AUTH CONTEXT
 * =============================================================================
 * File: frontend/src/contexts/AuthContext.jsx
 * Assigned to: PABLO
 * Responsibility: Global authentication state management
 * Status: IMPLEMENTED ✅
 * =============================================================================
 */// ⬆️ RECEIVES: nothing - this is a provider that GIVES data to others
// ⬇️ SENDS: user, isLoading, isAuthenticated, login(), signup(), logout(), updateProfile()


import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // children = whatever is inside <AuthProvider>...</AuthProvider>
  // In main.jsx, children is <PostsProvider><FriendsProvider><App/></FriendsProvider></PostsProvider>
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // useEfffect is triggered only when a user mounts the component, this happens when a user loads the app. UseEffect gets the data from localStorage and checks if the user is authenticated
  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('AuthContext checkAuth - token exists:', !!token);
      if (token) {
        try {
          const response = await apiClient.get('/auth/me/');
          console.log('Auth /me response:', response.data);
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } else {
        console.log('No token found, user not logged in');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login/', { email, password });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Fetch user info
      const userResponse = await apiClient.get('/auth/me/');
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  // Signup function
  const signup = async (username, email, password) => {
    try {
      await apiClient.post('/auth/signup/', { 
        username, 
        email, 
        password 
      });
      
      // Auto-login after signup
      const loginResult = await login(username, password);
      return loginResult;
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Signup failed' 
      };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.put(`/auth/profile/${user.profile.id}/`, profileData);
      setUser(prev => ({
        ...prev,
        profile: response.data
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
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
        updateProfile,
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
