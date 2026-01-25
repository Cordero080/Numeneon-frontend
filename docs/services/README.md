# Services Overview

**Location:** `frontend/src/services/`

## What Are Services?

Services are JavaScript files that handle **communication with the backend**. Instead of writing API calls directly in your components, you call a service function.

**Why?**

- Keeps components clean (no messy HTTP logic)
- Reusable — call the same function from anywhere
- One place to fix if the API changes

## Quick Reference

| Service              | What It Does                          | Backend Endpoint             |
| -------------------- | ------------------------------------- | ---------------------------- |
| `apiClient.js`       | Base HTTP client, handles auth tokens | N/A (used by other services) |
| `authService.js`     | Login, signup, logout                 | `/api/auth/`                 |
| `friendsService.js`  | Friend requests, friend list          | `/api/friends/`              |
| `messagesService.js` | Send/receive messages                 | `/api/messages/`             |
| `postsService.js`    | Create, read, delete posts            | `/api/posts/`                |
| `usersService.js`    | **Search all users** ⭐ NEW           | `/api/users/search/`         |

## How To Use

```jsx
// In any component:
import { searchUsers } from "@services/usersService";

const results = await searchUsers("pablo");
```

See individual service docs for details.
