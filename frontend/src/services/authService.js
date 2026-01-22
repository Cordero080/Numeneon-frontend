/**
 * authService - API wrapper for authentication endpoints
 *
 * Pattern: AuthContext → authService → apiClient → backend
 * All calls go through apiClient which adds JWT token header automatically.
 *
 * REFERENCE: See branch 'pablo-working-backup' for working implementation
 */

import apiClient from "./apiClient";

const authService = {
  /**
   * Login with email and password
   * POST /auth/login/ with { email, password }
   * Returns: { access: "token", refresh: "token" }
   */
  login: (email, password) => {
    // TODO: Use apiClient.post() to /auth/login/ with { email, password }
  },

  /**
   * Create new user account
   * POST /auth/signup/ with { username, email, password }
   * Returns: New user data
   */
  signup: (userData) => {
    // TODO: Use apiClient.post() to /auth/signup/ with userData
  },

  /**
   * Get current logged-in user's info (requires auth token)
   * GET /auth/me/
   * Returns: User object with profile
   */
  getMe: () => {
    // TODO: Use apiClient.get() to /auth/me/
  },

  /**
   * Update user's profile
   * PUT /auth/profile/{profileId}/
   * Returns: Updated profile
   */
  updateProfile: (profileId, profileData) => {
    // TODO: Use apiClient.put() to /auth/profile/${profileId}/ with profileData
  },

  /**
   * Refresh access token using refresh token
   * POST /auth/token/refresh/ with { refresh: refreshToken }
   * Returns: { access: "new_token" }
   */
  refreshToken: (refreshToken) => {
    // TODO: Use apiClient.post() to /auth/token/refresh/ with { refresh: refreshToken }
  },
};

export default authService;
