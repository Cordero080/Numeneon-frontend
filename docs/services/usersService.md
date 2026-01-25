# usersService.js ⭐ NEW

**File:** `frontend/src/services/usersService.js`

## What It Does

Searches for users in the **entire database** — not just friends or people you've seen.

## Why This Service Is Different

### The Problem Before

The SearchModal could only find:

- ✅ People already in your friends list
- ✅ People who posted something you could see
- ❌ **Brand new users** — INVISIBLE

So if your mom signed up, she couldn't find you. You couldn't find her. Nobody could discover new people.

### The Solution

This service calls the backend to search **ALL registered users**:

```
GET /api/users/search/?q=pablo
```

The backend searches the database for usernames/names matching "pablo" and returns them.

## Functions

| Function                      | What It Does                      |
| ----------------------------- | --------------------------------- |
| `searchUsers(query)`          | Search all users by name/username |
| `getUserByUsername(username)` | Get a specific user's profile     |

## How It Works

```
User types "mom" in search
        ↓
Frontend calls searchUsers("mom")
        ↓
Service sends: GET /api/users/search/?q=mom
        ↓
Backend searches User table in database
        ↓
Returns: [{ username: "momma123", first_name: "Mom", ... }]
        ↓
SearchModal displays results
```

## Key Concept: Debouncing

The SearchModal waits **300ms** after you stop typing before calling the API. This prevents spamming the server with a request for every keystroke.

```
Typing "pablo":
p → (wait) → a → (wait) → b → (wait) → l → (wait) → o → [300ms pause] → API call!
```

## Used In

- `SearchModal.jsx` — The search popup in TopBar

## Backend Requirement

⚠️ **This service needs a backend endpoint to work!**

The Django backend must have:

```
GET /api/users/search/?q=<query>
```

If this endpoint doesn't exist, the service fails silently and falls back to local-only search.
