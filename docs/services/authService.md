# authService.js

**File:** `frontend/src/services/authService.js`

## What It Does

Handles user authentication (proving who you are).

## Functions

| Function                    | What It Does                               |
| --------------------------- | ------------------------------------------ |
| `login(username, password)` | Sends credentials, gets back JWT tokens    |
| `signup(userData)`          | Creates new account                        |
| `logout()`                  | Clears tokens from storage                 |
| `refreshToken()`            | Gets new access token when old one expires |

## Key Concept: JWT Tokens

**JWT (JSON Web Token)** = A secure string the backend gives you after login. You send it with every request to prove you're logged in.

- **Access Token** — Short-lived (~15 min), used for requests
- **Refresh Token** — Long-lived (~7 days), used to get new access tokens

## Used In

- `AuthContext.jsx` — Manages login state across the app
- Login/Signup pages
