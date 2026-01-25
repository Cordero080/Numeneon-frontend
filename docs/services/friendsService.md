# friendsService.js

**File:** `frontend/src/services/friendsService.js`

## What It Does

Manages friend connections between users.

## Functions

| Function                         | What It Does             |
| -------------------------------- | ------------------------ |
| `getFriends()`                   | Get your friends list    |
| `sendFriendRequest(userId)`      | Send a friend request    |
| `acceptFriendRequest(requestId)` | Accept incoming request  |
| `rejectFriendRequest(requestId)` | Decline incoming request |
| `removeFriend(friendId)`         | Unfriend someone         |

## Used In

- `FriendsContext.jsx` — Keeps friends list in global state
- Friends page
- Profile page (friend/unfriend buttons)
