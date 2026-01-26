# NUMENEON WebSocket Implementation - Setup Guide

## What we Built

You just implemented **real-time notifications** for NUMENEON using Django Channels + WebSockets!

### What Works Now:
✅ Friend requests appear instantly (no more 30-second polling)
✅ Friend acceptances trigger toast notifications immediately
✅ New messages appear in real-time in open conversations
✅ Auto-reconnect if connection drops
✅ JWT authentication for WebSocket connections

---

## 📁 Files to Place in Your Frontend

Download all the files from the outputs and place them in these locations:

### 1. New Files (CREATE):
```
frontend/src/contexts/WebSocketContext.jsx
```

### 2. Updated Files (REPLACE):
```
frontend/src/contexts/FriendsContext.jsx
frontend/src/contexts/MessageContext.jsx
frontend/src/contexts/index.js
frontend/src/App.jsx
frontend/src/components/layout/TopBar.jsx
```

---

## 🧪 Testing Steps

### 1. Start Your Backend
```bash
cd backend
python manage.py runserver
```

Should see: `Starting ASGI/Daphne version 4.x.x`

### 2. Start Your Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Real-Time Friend Requests

**Setup:**
- Open two browser windows (or one normal + one incognito)
- Login as User A in Window 1
- Login as User B in Window 2

**Test:**
1. User A sends friend request to User B
2. Window 2 should **instantly** show the request (no refresh needed)
3. User B accepts the request
4. Window 1 should **instantly** show toast: "[Name] accepted your friend request!"

### 4. Test Real-Time Messages

**Setup:**
- Same two windows from above

**Test:**
1. User A opens messages with User B
2. User B opens messages with User A
3. User A types and sends a message
4. User B should see it **instantly** appear in the conversation

### 5. Check Browser Console

You should see logs like:
```
🔌 Connecting to WebSocket...
✅ WebSocket connected
📩 Message: {type: 'connection_established', ...}
```

---

## 🔧 Environment Variables

### Development (.env)
No changes needed - uses `ws://localhost:8000`

### Production (.env.production)
Make sure you have:
```
VITE_API_URL=https://numeneon-backend.onrender.com
```

The WebSocket will automatically use `wss://` (secure WebSocket) in production.

---

## 🚨 Troubleshooting

### "WebSocket connection failed"
**Check:**
1. Backend server is running with Daphne (see "Starting ASGI/Daphne")
2. You're logged in (token exists in localStorage)
3. URL is correct: `ws://localhost:8000/ws/notifications/`

### "Connection closes immediately"
**Check:**
1. JWT token is valid (not expired)
2. Token is being passed correctly in URL: `?token=xxx`
3. Check backend terminal for auth errors

### "Not seeing real-time updates"
**Check:**
1. Browser console shows "✅ WebSocket connected"
2. No errors in backend terminal
3. Try refreshing the page

### "Auto-reconnect not working"
**Check:**
1. Look for "Reconnecting in Xms..." in console
2. If you see "WebSocket closed: 1000", that's intentional (logout)
3. Other codes trigger auto-reconnect (up to 5 attempts)

---

## 📊 WebSocket Connection States

| State | Code | Meaning |
|-------|------|---------|
| CONNECTING | 0 | Opening connection |
| OPEN | 1 | Connected and ready |
| CLOSING | 2 | Connection closing |
| CLOSED | 3 | Connection closed |

Check current state in console:
```javascript
// Type this in browser console
window.ws = new WebSocket('ws://localhost:8000/ws/notifications/?token=' + localStorage.getItem('accessToken'))
ws.readyState  // Should return 1 when connected
```

---

## 🎯 What Changed

### Backend (Already Done):
- ✅ Django Channels installed and configured
- ✅ WebSocket consumer created
- ✅ JWT authentication middleware
- ✅ Notifications emitted from views

### Frontend (Files You Need to Place):
- ✅ WebSocketContext manages connection
- ✅ FriendsContext listens for friend events
- ✅ MessageContext listens for message events
- ✅ TopBar displays toast notifications
- ✅ App.jsx wraps providers in correct order

---

## 🔮 Future Enhancements

Ideas for later:
- **Typing indicators**: Show "User is typing..." in messages
- **Online status**: Show which friends are currently online
- **Read receipts**: Show when messages are read
- **Sound notifications**: Play a sound when events arrive
- **Browser notifications**: Use Notification API for desktop alerts

---

## 📝 Key Concepts Review

**WebSocket:**
- Persistent connection (phone line stays open)
- Bidirectional (client ↔ server can both initiate)
- Full-duplex (both can send simultaneously)

**consumers.py:**
- Like views.py but for WebSocket connections
- Handles connect, disconnect, receive events

**Channel Layer:**
- Message bus between views and consumers
- In-memory for dev, Redis for production

**Why modify views?**
- Views trigger events (friend request sent)
- `notify_user()` sends message through channel layer
- Consumer receives and pushes to WebSocket client

---

## ✅ Deployment Notes (For Later)

When deploying to Render:
1. Add Redis add-on (or use Upstash free tier)
2. Set `REDIS_URL` environment variable
3. Settings.py already configured to use Redis in production
4. No code changes needed!

---

## 🎓 What You Learned

1. **WebSocket fundamentals** - persistent connections vs polling
2. **Django Channels** - ASGI, consumers, routing
3. **Real-time architecture** - channel layers, pub/sub
4. **React integration** - custom hooks, context providers
5. **Auto-reconnect logic** - exponential backoff

You're now a full-stack engineer with real-time capabilities! 🚀

---

**Questions? Issues? Check the backend terminal and browser console first.**

Good luck with your capstone presentation! 🎉