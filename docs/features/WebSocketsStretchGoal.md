# WebSockets - Real-Time Notifications

## Status: ✅ BACKEND COMPLETE | 🔄 FRONTEND IN PROGRESS

---

## Current Implementation

### Backend (DONE ✅)

- Django Channels with Daphne ASGI server
- WebSocket endpoint: `ws://localhost:8000/ws/notifications/`
- Production: `wss://numeneon-backend.onrender.com/ws/notifications/`
- JWT authentication via query param
- Events emitted for friend requests, acceptances, and messages

### Frontend (TODO 🔄)

- [ ] Create WebSocketContext
- [ ] Connect on login, disconnect on logout
- [ ] Listen for events and trigger UI updates
- [ ] Remove 30-second polling (no longer needed)

---

## Events Reference

| Event Type        | Payload                                                     | Triggered When                      |
| ----------------- | ----------------------------------------------------------- | ----------------------------------- |
| `friend_request`  | `{ from_user: { id, username } }`                           | Someone sends you a friend request  |
| `friend_accepted` | `{ from_user: { id, username } }`                           | Someone accepts your friend request |
| `new_message`     | `{ from_user: { id, username }, message: { id, content } }` | Someone sends you a message         |

---

## What Are WebSockets?

Traditional HTTP is like **sending letters**:

- Client sends request → Server responds → Connection closes
- Client has to keep asking "anything new?" (polling)

WebSockets are like **a phone call**:

- Client and server establish a persistent connection
- Either side can send messages instantly
- No waiting, no repeated asking

### Visual Comparison

```
POLLING (Old way):
Client: "Any friend requests?" ────→ Server: "Nope"
         ... 30 seconds later ...
Client: "Any friend requests?" ────→ Server: "Nope"
         ... 30 seconds later ...
Client: "Any friend requests?" ────→ Server: "Yes! Maria accepted!"
         (User waited up to 30 seconds to find out)

WEBSOCKETS (Implemented ✅):
Client ←─────── persistent connection ───────→ Server
         ... Maria accepts request ...
Server: "Hey! Maria accepted!" ────→ Client (INSTANT!)
```

## Why WebSockets Are Better

| Feature         | Polling                   | WebSockets            |
| --------------- | ------------------------- | --------------------- |
| Speed           | 0-30 second delay         | Instant               |
| Server load     | Many unnecessary requests | Only when needed      |
| Battery/data    | Wasteful on mobile        | Efficient             |
| User experience | "Why isn't it updating?"  | "Wow, that was fast!" |

## Use Cases for NUMENEON

1. **Friend request accepted** - Toast appears instantly
2. **New friend request received** - Badge updates immediately
3. **New message received** - Real-time chat
4. **Post likes/comments** - Live engagement updates (future)

## Backend Setup (COMPLETED ✅)

The backend is now configured with:

- Django Channels + Daphne ASGI server
- `notifications/` app with WebSocket consumer
- JWT authentication for WebSocket connections
- Events emitted from friends and messages views

### Connection URL

```
Development: ws://localhost:8000/ws/notifications/?token=<JWT_TOKEN>
Production:  wss://numeneon-backend.onrender.com/ws/notifications/?token=<JWT_TOKEN>
```

---

## Frontend Implementation (TODO)

### Step 1: Create WebSocketContext

```jsx
// frontend/src/contexts/WebSocketContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef({});

  useEffect(() => {
    if (!user || !token) {
      // Close connection if logged out
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // Determine WebSocket URL based on environment
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost =
      window.location.hostname === "localhost"
        ? "localhost:8000"
        : "numeneon-backend.onrender.com";
    const wsUrl = `${wsProtocol}//${wsHost}/ws/notifications/?token=${token}`;

    const connect = () => {
      console.log("WebSocket connecting...");
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected!");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket message:", data);

        // Notify all listeners for this event type
        const callbacks = listenersRef.current[data.type] || [];
        callbacks.forEach((cb) => cb(data));
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected, reconnecting in 3s...");
        setIsConnected(false);
        setTimeout(connect, 3000); // Auto-reconnect
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user, token]);

  // Subscribe to event types
  const subscribe = (eventType, callback) => {
    if (!listenersRef.current[eventType]) {
      listenersRef.current[eventType] = [];
    }
    listenersRef.current[eventType].push(callback);

    // Return unsubscribe function
    return () => {
      listenersRef.current[eventType] = listenersRef.current[eventType].filter(
        (cb) => cb !== callback,
      );
    };
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};
```

### Step 2: Update App.jsx

```jsx
// Wrap app with WebSocketProvider (after AuthProvider)
<AuthProvider>
  <WebSocketProvider>
    <FriendsProvider>{/* ... rest of app */}</FriendsProvider>
  </WebSocketProvider>
</AuthProvider>
```

### Step 3: Listen for Events in FriendsContext

```jsx
// In FriendsContext.jsx
import { useWebSocket } from "./WebSocketContext";

// Inside FriendsProvider:
const { subscribe } = useWebSocket();

useEffect(() => {
  // Listen for friend_request events
  const unsubRequest = subscribe("friend_request", (data) => {
    console.log("New friend request from:", data.from_user);
    fetchFriends(); // Refresh pending requests
  });

  // Listen for friend_accepted events
  const unsubAccepted = subscribe("friend_accepted", (data) => {
    console.log("Friend request accepted by:", data.from_user);
    fetchFriends(); // Refresh friends list
    // TODO: Trigger toast notification
  });

  return () => {
    unsubRequest();
    unsubAccepted();
  };
}, [subscribe]);

// REMOVE the 30-second polling useEffect (no longer needed!)
```

### Step 4: Trigger Toast on Friend Accepted

The toast already exists in TopBar.jsx. Need to expose a way to trigger it globally (via context or event bus).

---

## Priority

| Feature                      | Status  |
| ---------------------------- | ------- |
| Backend WebSocket setup      | ✅ DONE |
| Frontend WebSocketContext    | 🔄 TODO |
| Friend request notifications | 🔄 TODO |
| Message notifications        | 🔄 TODO |
| Remove polling               | 🔄 TODO |

## Resources

- [Django Channels Documentation](https://channels.readthedocs.io/)
- [WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
