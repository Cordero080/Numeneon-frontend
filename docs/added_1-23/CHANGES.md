git push origin dev# Changes Made - January 23, 2026

## Summary

FriendsIcon cyberpunk redesign, MessageContext and messagesService for backend integration.

---

## Files Changed

### 1. `frontend/src/assets/icons/sidenav.jsx`

**FriendsIcon Redesign**

- Replaced generic two-user silhouette with cyberpunk-themed icon
- New design: Two figures with circuit link and glowing center node
- Matches the hex/circuit aesthetic of other sidenav icons (HexHomeIcon, SignalIcon)

### 2. `frontend/src/assets/icons/index.js`

**Export Cleanup**

- Removed duplicate `FriendsIcon` export from `user.jsx`
- Now exported only from `sidenav.jsx` to avoid conflicts

### 3. `frontend/src/components/layout/SideNav/SideNav.jsx`

**Minor Update**

- Updated icon import to use new FriendsIcon from sidenav

### 4. `frontend/src/contexts/MessageContext.jsx`

**Refactored for Backend Integration**

- Manages modal open/close state
- Fetches conversations list from `/api/messages/conversations/`
- Tracks selected conversation by user ID
- Functions: `fetchConversations()`, `fetchConversation(userId)`, `openMessages()`
- Handles loading and error states

### 5. `frontend/src/services/messagesService.js` (NEW)

**API Service for Messages**

- `getConversations()` → `GET /api/messages/conversations/`
- `getConversation(userId)` → `GET /api/messages/conversation/?user_id=X`
- `sendMessage(receiverId, content)` → `POST /api/messages/`
- `markAsRead(messageId)` → `PATCH /api/messages/{id}/read/`

---

## Backend API Expected

The frontend now expects these endpoints from Django backend:

| Method | Endpoint                                | Description                     |
| ------ | --------------------------------------- | ------------------------------- |
| GET    | `/api/messages/conversations/`          | List all conversations          |
| GET    | `/api/messages/conversation/?user_id=X` | Get messages with specific user |
| POST   | `/api/messages/`                        | Send a new message              |
| PATCH  | `/api/messages/{id}/read/`              | Mark message as read            |

---

## Commits

- `df7c87a` - FriendsIcon cyberpunk redesign, MessageContext and messagesService for backend integration
- `137f86d` - Renamed outdated helper function - groupPostsByUser
