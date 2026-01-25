# API URL Configuration Issue & Solution

## The Problem

When deploying to Vercel, the frontend was making requests to `localhost:8000` instead of the production backend (`numeneon-backend.onrender.com`).

### Why It Happened

We initially used Vite environment variables:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";
```

**The issue:** Vite env vars are baked in at **build time**, not runtime. Even though `VITE_API_URL` was set in Vercel's Environment Variables, the builds weren't picking it up due to:

- Build caching issues
- Timing of when the variable was set vs when builds ran
- Vercel's build process not injecting the variable correctly

### Symptoms

- Frontend deployed successfully
- Login/signup requests went to `localhost:8000`
- Browser console showed `ERR_CONNECTION_REFUSED`
- Worked locally but not on Vercel

---

## The Solution

Instead of build-time env vars, we check the hostname at **runtime**:

```javascript
// frontend/src/services/apiClient.js

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : "https://numeneon-backend.onrender.com/api";
```

### How It Works

| Where you're running      | `window.location.hostname`       | API URL used                                |
| ------------------------- | -------------------------------- | ------------------------------------------- |
| Local dev (`npm run dev`) | `localhost`                      | `http://localhost:8000/api`                 |
| Vercel production         | `numeneon-frontend.vercel.app`   | `https://numeneon-backend.onrender.com/api` |
| Any Vercel preview URL    | `numeneon-frontend-*.vercel.app` | `https://numeneon-backend.onrender.com/api` |

### Benefits

- ✅ No environment variables to configure
- ✅ Works automatically for all team members
- ✅ No build cache issues
- ✅ Instant switching based on where the code runs

---

## File Changed

**`frontend/src/services/apiClient.js`**

This is the axios client that all API calls go through. The base URL is set here.

---

## Related: CORS Configuration

The backend also needed to allow requests from the Vercel frontend. In Django `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",      # Vite dev server
    "http://localhost:3000",      # Alt local dev
    "https://numeneon-frontend.vercel.app",  # Production
]

# For preview URLs (dynamic):
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://numeneon-frontend.*\.vercel\.app$",
]
```

---

## Lesson Learned

For frontend apps deployed on Vercel, runtime hostname detection is more reliable than build-time environment variables when you need different API URLs for local vs production.
