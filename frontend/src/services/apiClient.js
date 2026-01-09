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

// Your code here

export default apiClient;
