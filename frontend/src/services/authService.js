// -------- File handles communication with Django backend using axios --------

import apiClient from "./apiClient";

const authService = {
  // POST /api/auth/login/ → { email, password } → { access, refresh }
  // Take credentials, get tokens and store in localStorage
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login/", { email, password });
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
    }
    return response.data; // return the user/token data to the caller (AuthContext)
  },
  // POST /api/auth/signup/ → { username, email, password } → { id, username, email }
  signup: async (username, email, password) => {
    const response = await apiClient.post("/auth/signup/", {
      username,
      email,
      password,
    });
    return response.data; // return the user data to the caller (AuthContext)
  },
  // GET /api/auth/me/ → Returns current user data
  getCurrentUser: async () => {
    // relies on the apiClient interceptor to attach JWT token
    const response = await apiClient.get("/auth/me/");
    return response.data;
  },
  // PUT /api/auth/profile/:id/ → Update profile
  updateProfile: async (id, profileData) => {
    const response = await apiClient.put(`/auth/profile/${id}/`, profileData);
    return response.data;
  },
  // Manual logout utility
  logout: () => {
    // pure data cleanup - no API call needed - UI cleanup handled in AuthContext
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

export default authService;
