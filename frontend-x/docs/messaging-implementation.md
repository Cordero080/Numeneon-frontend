# Frontend Messaging Implementation

## Overview

This document explains how the messaging system works on the frontend and the changes made during implementation.

---

## Architecture

```
Frontend Messaging Flow
========================

User clicks "Messages" icon
        ↓
    TopBar.jsx
        ↓
    useMessages().openMessages()
        ↓
    MessageContext (state management)
        ↓
    messagesService.js (API calls)
        ↓
    Backend /api/messages/*
```

---

## Files Involved

| File                                      | Purpose                          |
| ----------------------------------------- | -------------------------------- |
| `services/messagesService.js`             | API calls to backend             |
| `contexts/MessageContext.jsx`             | State management, provides hooks |
| `MessageModal/MessageModal.jsx`           | Main UI component                |
| `MessageModal/styles/_conversations.scss` | Conversation list styling        |

---

## messagesService.js

**Location:** `frontend/src/services/messagesService.js`

This service handles all API communication with the backend. Uses `apiClient` which automatically adds JWT tokens.

### Methods:

```javascript
messagesService.getConversations();
// GET /api/messages/conversations/
// Returns: Array of { user, last_message, unread_count }

messagesService.getConversation(userId);
// GET /api/messages/conversation/?user_id={userId}
// Returns: Array of message objects for that conversation

messagesService.sendMessage(receiverId, content);
// POST /api/messages/
// Body: { receiver_id, content }
// Returns: Created message object

messagesService.markAsRead(messageId);
// PATCH /api/messages/{id}/read/
// Marks a message as read
```

---

## MessageContext.jsx

**Location:** `frontend/src/contexts/MessageContext.jsx`

### State:

- `conversations` - List of all conversations
- `selectedUserId` - Currently selected conversation partner
- `selectedMessages` - Messages in current conversation
- `isMessageModalOpen` - Modal visibility
- `isLoading` - Loading state

### Actions:

- `openMessages(userId?)` - Open modal, optionally select a user
- `closeMessages()` - Close modal
- `selectConversation(userId)` - Switch to different conversation
- `sendMessage(content)` - Send message to selected user
- `refreshConversations()` - Re-fetch conversation list

### Helpers:

- `getDisplayName(user)` - Returns "First Last" or username
- `getInitials(user)` - Returns "FL" for avatars

---

## Data Shape: API vs Mock

The original mock data had a different shape than the API returns:

### Mock Data (OLD):

```javascript
{
  id: 1,
  name: "John Doe",
  avatar: null,
  lastMessage: "Hey there!",
  timestamp: "2m ago",
  unread: 2,
  messages: [
    { id: 1, text: "Hey!", sender: "them", time: "2:30 PM" }
  ]
}
```

### API Data (NEW):

```javascript
{
  user: {
    id: 5,
    username: "johnd",
    first_name: "John",
    last_name: "Doe"
  },
  last_message: {
    id: 1,
    sender: { id: 5, username: "johnd", ... },
    receiver: { id: 1, username: "me", ... },
    content: "Hey there!",
    is_read: false,
    created_at: "2026-01-22T15:30:00Z"
  },
  unread_count: 2
}
```

### Key Differences:

| Mock                  | API                                | Fix                               |
| --------------------- | ---------------------------------- | --------------------------------- |
| `conv.name`           | `conv.user.first_name + last_name` | Use `getDisplayName()`            |
| `conv.lastMessage`    | `conv.last_message.content`        | Dot notation                      |
| `conv.unread`         | `conv.unread_count`                | Renamed                           |
| `msg.text`            | `msg.content`                      | Renamed                           |
| `msg.sender === "me"` | `msg.sender.id === user.id`        | Compare IDs                       |
| `msg.time`            | `msg.created_at`                   | Format with `formatMessageTime()` |

---

## Styling: Unread Badge

**Location:** `MessageModal/styles/_conversations.scss`

The unread badge is a notification bubble that appears next to conversations with unread messages.

```scss
.conversation-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.unread-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff3366, #ff0055);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 0 8px rgba(255, 51, 102, 0.6);
  animation: pulse-glow 2s ease-in-out infinite;
}
```

---

## Avatar Pattern

For messaging, we use **initials** (not silhouettes) because users need to distinguish between conversation partners.

```jsx
// In MessageModal.jsx
const initials = getInitials(conv.user);

<div className="conversation-avatar">
  <span className="initial-1">{initials[0]}</span>
  {initials.length > 1 && <span className="initial-2">{initials[1]}</span>}
</div>;
```

The `getInitials()` helper in MessageContext:

```javascript
const getInitials = (user) => {
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  if (user.first_name) {
    return user.first_name.slice(0, 2).toUpperCase();
  }
  return user.username.slice(0, 2).toUpperCase();
};
```

---

## How to Open Messages

From any component:

```jsx
import { useMessages } from '@contexts';

function MyComponent() {
  const { openMessages } = useMessages();

  // Open messages modal (general)
  <button onClick={() => openMessages()}>Messages</button>

  // Open to specific user's conversation
  <button onClick={() => openMessages(userId)}>DM</button>
}
```

---

## Components Using useMessages()

| Component              | What it uses                                          |
| ---------------------- | ----------------------------------------------------- |
| `TopBar.jsx`           | `isMessageModalOpen`, `openMessages`, `closeMessages` |
| `SideNav.jsx`          | `isMessageModalOpen`, `openMessages`                  |
| `SearchModal.jsx`      | `openMessages`                                        |
| `Friends.jsx`          | `openMessages`                                        |
| `Profile.jsx`          | `openMessages`                                        |
| `TimelineRiver.jsx`    | `openMessages`                                        |
| `TimelineRiverRow.jsx` | `openMessages`                                        |
| `MessageModal.jsx`     | Everything (conversations, messages, send, etc.)      |

---

## Testing

1. Log in as `pabloPistola`
2. Click the Messages icon in TopBar
3. You should see 5 conversations with unread badges
4. Click a conversation to see message history
5. Type and send a message — it should appear immediately
