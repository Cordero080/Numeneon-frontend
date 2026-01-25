# postsService.js

**File:** `frontend/src/services/postsService.js`

## What It Does

CRUD operations for posts (the main content of the timeline).

## Key Concept: CRUD

**CRUD** = Create, Read, Update, Delete — the four basic operations for any data.

## Functions

| Function              | What It Does                |
| --------------------- | --------------------------- |
| `getPosts()`          | Fetch all posts (your feed) |
| `getPostById(id)`     | Fetch one specific post     |
| `createPost(content)` | Create a new post           |
| `deletePost(id)`      | Delete your post            |
| `likePost(id)`        | Like/unlike a post          |

## Used In

- `PostsContext.jsx` — Keeps posts in global state
- Home page timeline
- Profile page (user's posts)
- Post composer component
