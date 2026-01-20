// =============================================================================
// 🟠 TITO - Infrastructure Lead
// apiClient.js - Base HTTP client with automatic auth token handling
// =============================================================================
//
// TODO: Create an Axios instance with interceptors for JWT authentication
//
// This is the foundation of all API communication. Every service
// (postsService, friendsService) uses this client.
//
// REQUIREMENTS:
// 1. Create axios instance with baseURL: 'http://localhost:8000/api'
// 2. Request interceptor: Add JWT token to Authorization header
// 3. Response interceptor: Handle 401 errors with token refresh
//
// REQUEST INTERCEPTOR:
// - Before every request, check localStorage for 'accessToken'
// - If token exists, add header: Authorization: Bearer <token>
//
// RESPONSE INTERCEPTOR:
// - If response is 401 (Unauthorized) and we haven't retried yet:
//   1. Get refreshToken from localStorage
//   2. POST to /api/auth/token/refresh/ with { refresh: refreshToken }
//   3. Store new access token
//   4. Retry the original request with new token
// - If refresh fails, clear tokens and redirect to /login
//
// Think about:
// - Why use an interceptor instead of manually adding tokens?
// - What's the difference between access and refresh tokens?
// - How do you prevent infinite retry loops?
//
// Hint: axios.create({ baseURL, headers })
// Hint: apiClient.interceptors.request.use(config => { ... })
// Hint: apiClient.interceptors.response.use(response => response, async error => { ... })
// Hint: originalRequest._retry = true to track retry attempts
// =============================================================================

import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// TODO: Create axios instance with baseURL and default headers
// Hint: const apiClient = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

// TODO: Add request interceptor to attach JWT token
// Hint: apiClient.interceptors.request.use(config => { ... })
// Hint: const token = localStorage.getItem('accessToken');
// Hint: if (token) config.headers.Authorization = `Bearer ${token}`;

// TODO: Add response interceptor to handle 401 and refresh token
// Hint: apiClient.interceptors.response.use(response => response, async error => { ... })
// Hint: Check error.response?.status === 401
// Hint: Get refresh token, POST to /api/auth/token/refresh/
// Hint: On success, retry original request
// Hint: On failure, clear tokens and redirect to /login

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
// Add request interceptor - attach JWT token to the outgoing package
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // django SimpleJWT expects Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
// Add response interceptor: handle the expired keys (401 errors)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // check if error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // mark to prevent infinite loops

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        // using stnadard axios to avoid interceptor loop
        const response = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          {
            refresh: refreshToken,
          },
        );
        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.access);
          // updatting the header and retrying original request
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // if refresh fails, the user must log in again
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    // if not a 401 or already retried, reject the promise
    return Promise.reject(error);
  },
);

export default apiClient;
