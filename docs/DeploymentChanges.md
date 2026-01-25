# Deployment Changes - January 24, 2026

## Overview

Frontend deployed to **Vercel**, Backend deployed to **Render**.

---

## Files Changed

### Frontend

| File                                 | Change          | Why                                                                                                           |
| ------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------- |
| `frontend/vercel.json`               | Created         | Configures Vercel for SPA routing - rewrites all routes to `/` so React Router handles client-side navigation |
| `frontend/src/services/apiClient.js` | Updated API URL | Changed from `localhost:8000` to `https://numeneon-backend.onrender.com/api` for production                   |

### Backend

| File          | Change                | Why                                                                                                |
| ------------- | --------------------- | -------------------------------------------------------------------------------------------------- |
| `settings.py` | Updated CORS settings | Added Vercel frontend URL to `CORS_ALLOWED_ORIGINS` so the deployed frontend can make API requests |

---

## Vercel Configuration

**Root Directory:** `frontend`

This tells Vercel where to find `package.json` and run the build.

---

## Environment URLs

| Service           | URL                                   |
| ----------------- | ------------------------------------- |
| Frontend (Vercel) | https://numeneon-frontend.vercel.app  |
| Backend (Render)  | https://numeneon-backend.onrender.com |

---

## CORS Allowed Origins (Backend)

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",           # Vite dev server
    "http://localhost:3000",           # Alt local dev
    "https://numeneon-frontend.vercel.app",  # Production
]
```

---

## Local Development

No changes needed for local dev. The backend still accepts `localhost:5173`.

**Note:** If you're working locally, you may want to temporarily revert `apiClient.js` to use `localhost:8000` or set up environment variables (future improvement).

---

## Quick Reference

- **Frontend deploys automatically** when you push to `dev` branch
- **Backend deploys automatically** on Render when you push to its repo
- If you add a new frontend domain, add it to `CORS_ALLOWED_ORIGINS` in backend `settings.py`
