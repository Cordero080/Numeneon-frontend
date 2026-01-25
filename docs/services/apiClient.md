# apiClient.js

**File:** `frontend/src/services/apiClient.js`

## What It Does

The **foundation** for all other services. It's a pre-configured HTTP client that:

1. **Sets the base URL** — Points to localhost (dev) or Render (production) automatically
2. **Attaches auth tokens** — Adds your JWT token to every request so the backend knows who you are
3. **Handles token refresh** — If your token expires, it automatically gets a new one

## Key Concept: Interceptors

**Interceptor** = code that runs before every request or after every response.

```js
// Before every request: add the auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## Used By

Every other service imports `apiClient` instead of raw `axios`:

```js
import apiClient from "./apiClient";

// Now all requests automatically have auth headers
apiClient.get("/posts/");
```
