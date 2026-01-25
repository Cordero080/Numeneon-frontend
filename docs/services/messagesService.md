# messagesService.js

**File:** `frontend/src/services/messagesService.js`

## What It Does

Handles direct messaging between users.

## Functions

| Function                       | What It Does                         |
| ------------------------------ | ------------------------------------ |
| `getConversations()`           | Get list of all your message threads |
| `getMessages(userId)`          | Get messages with a specific user    |
| `sendMessage(userId, content)` | Send a message                       |

## Used In

- `MessageContext.jsx` — Manages messaging state
- Message panel/modal
- SearchModal (quick message button on user results)
