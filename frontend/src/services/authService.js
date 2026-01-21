/**
 * =============================================================================
 * AUTH SERVICE - TODO: NATALIA
 * =============================================================================
 * File: frontend/src/services/authService.js
 * Assigned to: NATALIA
 * Status: TODO 🟡
 * Pattern: AuthContext → authService → apiClient → backend
 * 
 * REFERENCE: See branch 'pablo-working-backup' for working implementation
 * =============================================================================
 * 
 * WHAT THIS FILE DOES:
 * - Wraps API calls related to authentication
 * - Used by AuthContext (or can be used directly)
 * - All calls go through apiClient which adds JWT token header
 * 
 * =============================================================================
 * API ENDPOINTS:
 * =============================================================================
 * 
 * POST /api/auth/login/     - Login with { email, password }
 *                             Returns: { access: "token", refresh: "token" }
 * 
 * POST /api/auth/signup/    - Create account with { username, email, password }
 *                             Returns: New user data
 * 
 * GET  /api/auth/me/        - Get current user info (requires auth)
 *                             Returns: User object with profile
 * 
 * PUT  /api/auth/profile/:id/ - Update profile with { bio, avatar, etc. }
 *                             Returns: Updated profile
 * 
 * POST /api/auth/token/refresh/ - Refresh access token
 *                             Body: { refresh: "token" }
 *                             Returns: { access: "new_token" }
 * 
 * =============================================================================
 */

import apiClient from "./apiClient";

const authService = {
  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise} { access: "token", refresh: "token" }
   */
  login: (email, password) => {
    // TODO: POST to /auth/login/ with { email, password }
    return apiClient.post("/auth/login/", { email, password });
  },

  /**
   * Create new user account
   * @param {object} userData - { username, email, password }
   * @returns {Promise} New user data
   */
  signup: (userData) => {
    // TODO: POST to /auth/signup/ with userData
    return apiClient.post("/auth/signup/", userData);
  },

  /**
   * Get current logged-in user's info
   * Requires valid JWT token (apiClient adds it automatically)
   * @returns {Promise} User object with profile
   */
  getMe: () => {
    // TODO: GET /auth/me/
    return apiClient.get("/auth/me/");
  },

  /**
   * Update user's profile
   * @param {number} profileId
   * @param {object} profileData - { bio, avatar, location, etc. }
   * @returns {Promise} Updated profile
   */
  updateProfile: (profileId, profileData) => {
    // TODO: PUT to /auth/profile/{profileId}/
    return apiClient.put(`/auth/profile/${profileId}/`, profileData);
  },

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken
   * @returns {Promise} { access: "new_token" }
   */
  refreshToken: (refreshToken) => {
    // TODO: POST to /auth/token/refresh/
    return apiClient.post("/auth/token/refresh/", { refresh: refreshToken });
  },
};

export default authService;
