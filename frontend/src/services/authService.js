// 🟡 NATALIA - Auth & Users Lead
// authService.js - Auth API calls wrapper
// Pattern: AuthContext → authService → apiClient → backend

import apiClient from "./apiClient";

const authService = {
  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise} { access: "token", refresh: "token" }
   */
  login: (email, password) =>
    apiClient.post("/auth/login/", { email, password }),

  /**
   * Create new user account
   * @param {object} userData - { username, email, password }
   * @returns {Promise} New user data
   */
  signup: (userData) => apiClient.post("/auth/signup/", userData),

  /**
   * Get current logged-in user's info
   * Requires valid JWT token (apiClient adds it automatically)
   * @returns {Promise} User object with profile
   */
  getMe: () => apiClient.get("/auth/me/"),

  /**
   * Update user's profile
   * @param {number} profileId
   * @param {object} profileData - { bio, avatar, location, etc. }
   * @returns {Promise} Updated profile
   */
  updateProfile: (profileId, profileData) =>
    apiClient.put(`/auth/profile/${profileId}/`, profileData),

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken
   * @returns {Promise} { access: "new_token" }
   */
  refreshToken: (refreshToken) =>
    apiClient.post("/auth/token/refresh/", { refresh: refreshToken }),
};

export default authService;
