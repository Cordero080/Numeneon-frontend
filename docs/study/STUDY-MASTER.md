# NUMENEON STUDY MASTER PLAN — IKM GAP CLOSURE EDITION

## 🎯 MISSION: Close the IKM Gaps for Technical Interviews

**Context:** Scored 70 on IKM Custom Python3/React assessment. Graduation done (Jan 24, 2026).
**Goal:** Fix specific weak areas so I can nail the next assessment and interview questions cold.
**Method:** The Chunk Method — one block at a time, I explain it back, then write it cold.
**Pneuma AI dissection:** PAUSED. Interview prep comes first.

---

## 👤 WHO I AM

Pablo — UI Lead on NUMENEON (GA capstone, graduated Feb 2026). 45, career changer.
Visual/spatial thinker with synesthesia. Martial arts background — I learn through kata (repetition of correct form).
Built the entire frontend. Know React concepts better than Python syntax. Know my own code better than abstract trivia.

**My Strengths:** Visual/spatial thinking · Pattern recognition · UI/UX design background · Built the whole frontend
**My Challenge:** Python syntax gaps · Abstract React patterns I haven't used in my own code

---

## 📚 MY ACTUAL CODEBASE (Updated March 2026)

**Frontend:** React 18 + Vite + Context API + Axios
**Backend:** Django 5.2 + DRF + JWT Auth + Django Channels + WebSockets + Redis (separate repo)
**Deployed:** Render

### 10 Contexts (🟡 ORCHESTRATORS — Global state managers)

| Context | What it does |
|---|---|
| AuthContext | login/logout, JWT storage, currentUser |
| PostsContext | posts CRUD, likes, comments |
| FriendsContext | friends list, requests |
| MessageContext | messaging (mock data) |
| ThemeContext | dark/light mode toggle |
| SearchContext | search modal state |
| WebSocketContext | WebSocket connection + message routing |
| NotificationContext | notification state |
| StoriesContext | stories feature state |
| SideNavContext | sidebar open/close state |

### 10 Services (🔵 UTILITIES — API communication layer)

| Service | What it does |
|---|---|
| apiClient.js | Axios instance with JWT interceptors — ALL requests flow through here |
| postsService.js | posts API calls |
| friendsService.js | friends/users API calls |
| authService.js | signup/login API calls |
| messagesService.js | messages API calls |
| usersService.js | user profile API calls |
| storiesService.js | stories API calls |
| myStudioService.js | MyStudio API calls |
| studioSpaceService.js | StudioSpace API calls |
| pushService.js | push notification API calls |

### 7 Backend Apps (separate repo — Django REST API)

**Path:** `/Users/pablodcordero/code/ga/unit-4/Numeneon-backend/backend/`

| App | Key extra files | What's notable |
|---|---|---|
| users | signals.py | Auto-creates Profile on User save; email-based login (not username) |
| posts | — | Post types: thoughts/media/milestones; replies via parent FK; @mentions |
| friends | — | FriendRequest exists = pending; accept creates 2-way Friendship records |
| messages_app | seed_messages.py | Real DMs; conversation list; can reply to a Story |
| notifications | consumers.py · routing.py · middleware.py · utils.py | WS auth via JWT query string; push via pywebpush |
| mystudio | deezer_utils.py · seed_myspace.py | Playlist max 5 songs; iTunes → Deezer fallback |
| stories | cleanup_expired_stories.py | UUID primary key; 24h auto-expiry; reactions |

---

## 🧠 THE CHUNK METHOD (NEVER BREAK THESE RULES)

1. Show ONE code block at a time
2. Comment INSIDE the code explaining every line
3. Plain English explanation after — no jargon
4. Note ONE connection to another file
5. Ask "Got it?" and WAIT for my response
6. Never move to next chunk until I confirm
7. I explain it back to you before we move on
8. Session ends with me writing the concept cold — no notes

### How to comment code

```javascript
// WHAT THIS IS: short description
// WHY IT EXISTS: what problem it solves
// CONNECTION: → feeds into [OtherFile.jsx]

const example = someFunction(); // ← what this line does
```

---

## 🔴 PRIORITY 1 — React Lifecycle / useEffect

**Why it failed:** Didn't know the cleanup return pattern. Memory leak question was a blind spot.

**Files to dissect:** `PostsContext.jsx` → `WebSocketContext.jsx` → `Home.jsx` → `Profile.jsx`

**For every `useEffect` found, answer:**
1. What triggers it? (what's in the dependency array?)
2. What does it do?
3. Does it have a cleanup/return function? Why or why not?
4. What happens if there's NO cleanup — what leaks?

**Key pattern I must be able to write cold:**

```jsx
useEffect(() => {
  // WHAT THIS IS: subscribing to something (WebSocket, event listener, timer)
  // WHY IT EXISTS: we need to start the connection when component mounts
  const subscription = something.subscribe();

  return () => {
    // WHAT THIS IS: cleanup function — runs when component UNMOUNTS
    // WHY IT EXISTS: prevents memory leaks — cancels the subscription
    // CONNECTION: → if we skip this, the old subscription keeps running even after component is gone
    subscription.unsubscribe();
  };
}, []); // ← empty array = run once on mount, cleanup on unmount
```

**Empty array `[]` = run once. `[value]` = run when value changes. No array = run every render.**

**How to start:** "Let's start with Priority 1 — show me the first useEffect in PostsContext.jsx"

---

## 🔴 PRIORITY 2 — React Props / Stateless vs Stateful

**Why it failed:** Render Props pattern was completely unfamiliar.
**Also:** `<Route>` with no `path` = 404 catch-all (I picked server-side instead of React Router answer).

**Files to dissect:** `PostCard.jsx` → icon components → `ProtectedRoute.jsx` → `TimelineRiverRow.jsx`

**For every component found, ask:**
1. Is it stateless (just receives + displays) or stateful (has useState)?
2. What props does it receive?
3. Which props are functions called back UP to the parent?
4. Why does it own no state?

**Key pattern — stateless component:**

```jsx
// WHAT THIS IS: stateless component — receives data, renders it, calls back up
// WHY IT EXISTS: PostCard doesn't need to own state — PostsContext owns the truth
// CONNECTION: → likePost() is defined in PostsContext, passed down through TimelineRiverRow
function PostCard({ post, onLike, onDelete }) {
  return (/* displays post data, calls onLike when heart clicked */);
}
```

**React Router catch-all:**

```jsx
// WHAT THIS IS: catch-all 404 route — no path means "matches everything not already matched"
// WHY IT EXISTS: if no other route matched, render the NotFound page
<Route path="*" element={<NotFound />} />
```

> **⚠️ TEST RULE — BURNED ME ONCE:**
> When a question says "in a React application" → the answer lives inside React Router, NOT on the server.
> Catch-all 404 = a `<Route>` with no `path`, placed LAST inside `<Switch>` (or `path="*"` in v6).
> If you're thinking nginx / server config / redirects — stop. It's a React Router answer.

**How to start:** "Let's start with Priority 2 — show me PostCard.jsx"

---

## 🟡 PRIORITY 3 — Python Exception Handling

**Why it failed:** TupleError/PythonError/FileError fooled me — I didn't know which were real.

**Files to dissect:** `Numeneon-backend/backend/posts/views.py` → `users/views.py` → `friends/views.py`

**For every `try/except` found:**
1. What is being attempted?
2. What exception is caught — is it a REAL Python built-in?
3. What does the fallback response return?

**Real Python exceptions I must know:**

```python
TypeError        # wrong data type passed
KeyError         # dictionary key doesn't exist
ValueError       # right type, wrong value
FileNotFoundError  # file doesn't exist
IndexError       # list index out of range
AttributeError   # object has no that attribute
Exception        # catches EVERYTHING — use as last resort

# FAKE — these do NOT exist:
# TupleError, PythonError, FileError, ListError

# ALSO A TEST TRAP — sys.copy() does not exist. sys is for system ops only: sys.exit(), sys.argv, sys.path
```

**Pattern:**

```python
try:
    # attempt the risky thing
    user = User.objects.get(id=user_id)
except User.DoesNotExist:
    # Django model raises this if not found — it IS real
    return Response({'error': 'User not found'}, status=404)
except Exception as e:
    # catches any other unexpected error
    return Response({'error': str(e)}, status=500)
```

---

## 🟡 PRIORITY 4 — Python Strings

**Why it failed:** %s vs %r — didn't know the difference. f-strings were fine.

**Files to dissect:** `Numeneon-backend/backend/posts/serializers.py` → `users/serializers.py`

**Three string formatting styles:**

```python
# f-string (MODERN — use this)
message = f"Hello {username}"          # ← inserts value directly

# %s (OLD WAY — converts to string)
message = "Hello %s" % username        # ← same result as f-string

# %r (DEVELOPER repr — shows type, adds quotes around strings)
message = "Value is %r" % value        # ← "Value is 'pablo'" — useful for debugging

# len() — gets length of string, list, dict
len("hello")    # → 5
len([1, 2, 3])  # → 3

# .append() — mutates list IN PLACE, returns None
my_list = [1, 2]
result = my_list.append(3)  # my_list is now [1, 2, 3]
print(result)               # → None  ← THIS IS THE TRICK QUESTION
```

---

## 🟡 PRIORITY 5 — Python File I/O

**Why it failed:** `readline()` vs `readlines()` not clear. `sys` module purpose unclear.

**Files to dissect:** `Numeneon-backend/backend/seed_posts.py` → `numeneon/settings.py`

**Key pattern:**

```python
# Reading a file — use 'with' so it auto-closes
with open('filename.txt', 'r') as f:    # 'r' = read mode
    line = f.readline()                  # reads ONE line
    all_lines = f.readlines()            # reads ALL lines as list

# Writing a file
with open('filename.txt', 'w') as f:    # 'w' = write mode (overwrites)
    f.write("some text")

# sys module — system-level stuff (NOT file I/O itself)
import sys
sys.argv        # command-line arguments list
sys.exit()      # exit the program
sys.path        # where Python looks for modules

# input() — reads from TERMINAL (not file)
name = input("What's your name? ")      # blocks until user types
```

---

## ✅ CONCEPTS ALREADY MASTERED

**React:**
- Providers wrap children (Russian dolls) · `{children}` prop
- Axios instance with JWT interceptors · `response.data` vs full axios response
- Optional chaining `?.` · Conditional rendering with `&&` and `.length > 0`
- `useState`, `createContext`, `useContext`
- Dynamic routing with `:id` params
- Stateless components (nailed it on the test)
- Class instantiation with `new ClassName()`
- `super()` passes args to parent class

**Python:**
- Dictionary keys must be immutable
- `.append()` returns None (mutates in place)
- `input()` reads from terminal
- `issubclass()` checks inheritance
- `useEffect` cleanup prevents memory leaks (now solid)

---

## 🔄 KEY FLOWS ALREADY KNOWN (Can explain these)

```
Login:       Login.jsx → AuthContext → apiClient → backend → JWT → redirect
Create Post: ComposerModal → PostsContext → postsService → apiClient → backend
Like Post:   TimelineRiverRow → PostsContext.likePost() → postsService → backend
Live Notif:  backend → WebSocket → WebSocketContext → NotificationContext → UI
```

---

## 📋 FULL FILE STUDY LIST (in order)

### 🔴 Backend — HIGH (IKM gaps + interview must-knows)

| # | File | Why |
|---|---|---|
| 1 | `posts/views.py` | PostViewSet, @action, try/except — directly tests Priority 3 |
| 2 | `posts/serializers.py` | String ops, computed fields (is_liked), nested serializer |
| 3 | `posts/models.py` | Post (thoughts/media/milestones), Like, parent FK for replies |
| 4 | `users/views.py` | JWT generation, email_login, exception handling |
| 5 | `users/serializers.py` | EmailLoginSerializer, UserSerializer, ProfileSerializer |
| 6 | `friends/views.py` | Function-based views, accept/decline flow |
| 7 | `friends/models.py` | Friendship (2-way), FriendRequest (exists = pending) |

### 🟡 Backend — MEDIUM (real-time system)

| # | File | Why |
|---|---|---|
| 8 | `notifications/consumers.py` | WebSocket lifecycle: connect/receive/disconnect |
| 9 | `notifications/utils.py` | notify_user(), send_push_notification() — how events fire |
| 10 | `notifications/middleware.py` | JWTAuthMiddleware — extracts JWT from WS query string |
| 11 | `notifications/routing.py` | Maps ws/notifications/ to NotificationConsumer |
| 12 | `numeneon/settings.py` | CORS, JWT config, Channels, VAPID, installed apps |
| 13 | `numeneon/asgi.py` | HTTP→Django, WS→JWTMiddleware→URLRouter |
| 14 | `numeneon/urls.py` | All app routers |

### 🟢 Backend — REFERENCE (explain high-level)

| # | File | What it does |
|---|---|---|
| 15 | `users/signals.py` | Auto-creates Profile when User is created (post_save signal) |
| 16 | `messages_app/models.py` | Message: sender, receiver, is_read, optional reply_to_story |
| 17 | `messages_app/views.py` | Conversation list, per-user thread, read-all |
| 18 | `mystudio/models.py` | MySpaceProfile (OneToOne User), PlaylistSong (max 5, ordered) |
| 19 | `mystudio/views.py` | Profile CRUD, song search, playlist add/remove/reorder |
| 20 | `mystudio/deezer_utils.py` | iTunes (primary) + Deezer (fallback) preview URL |
| 21 | `stories/models.py` | Story (UUID PK, 24h expiry), StoryView, StoryReaction |
| 22 | `stories/views.py` | Create/list/delete, view tracking, react/unreact |
| 23 | `seed_posts.py` | Populates feed with mock data — good File I/O study |

### 🔴 Frontend — HIGH (IKM gap targets)

| # | File | Why |
|---|---|---|
| 24 | `contexts/PostsContext.jsx` | useEffect lifecycle — Priority 1 target |
| 25 | `contexts/WebSocketContext.jsx` | useEffect cleanup pattern — Priority 1 target |
| 26 | `PostCard.jsx` | Stateless component, props — Priority 2 target |
| 27 | `components/ui/ProtectedRoute.jsx` | Auth guard, props — Priority 2 target |

### 🟡 Frontend — MEDIUM (interview must-knows)

| # | File | Why |
|---|---|---|
| 28 | `services/apiClient.js` | ALL requests flow through here — JWT interceptors |
| 29 | `contexts/AuthContext.jsx` | Login/logout, token storage |
| 30 | `contexts/FriendsContext.jsx` | Context pattern in action |
| 31 | `contexts/NotificationContext.jsx` | Receives WS events, manages badge state |
| 32 | `contexts/StoriesContext.jsx` | Stories data + viewed tracking |
| 33 | `services/postsService.js` | Service layer pattern |
| 34 | `main.jsx` | All 10 providers in nesting order |
| 35 | `App.jsx` | Routing, ProtectedRoute, layout |

### 🟢 Frontend — REFERENCE

| # | File | What it does |
|---|---|---|
| 36 | `groupPosts.js` | River Timeline grouping algorithm |
| 37 | `TimelineRiverFeed.jsx` | Renders grouped posts in 3-column rows |
| 38 | `TimelineRiverRow.jsx` | Per-row orchestrator (Thoughts / Media / Milestones) |
| 39 | `ComposerModal.jsx` | Post creation, modal pattern, form state |
| 40 | `ProfileCard.jsx` | Flip card, activity visualization |
| 41 | Remaining services & contexts | Know what they do, not how |

---

## 📐 PROJECT STRUCTURE (Current — March 2026)

```
frontend/src/
├── main.jsx                    (🔴 ENTRY — React app starts, all providers wrap here)
├── App.jsx                     (🟡 ORCHESTRATOR — routing + layout)
│
├── contexts/                   (🟡 ORCHESTRATORS — 10 total)
│   ├── AuthContext.jsx         (login/logout, JWT storage)
│   ├── PostsContext.jsx        (posts CRUD, likes)
│   ├── FriendsContext.jsx      (friends, requests)
│   ├── MessageContext.jsx      (messaging)
│   ├── ThemeContext.jsx        (dark/light mode)
│   ├── SearchContext.jsx       (search modal state)
│   ├── WebSocketContext.jsx    (WS connection + routing)
│   ├── NotificationContext.jsx (notification state)
│   ├── StoriesContext.jsx      (stories state)
│   └── SideNavContext.jsx      (sidebar open/close)
│
├── services/                   (🔵 UTILITIES — 10 total, all go through apiClient)
│   ├── apiClient.js            (Axios instance — JWT interceptors live here)
│   ├── postsService.js
│   ├── friendsService.js
│   ├── authService.js
│   ├── messagesService.js
│   ├── usersService.js
│   ├── storiesService.js
│   ├── myStudioService.js
│   ├── studioSpaceService.js
│   └── pushService.js
│
├── components/
│   ├── layout/                 (🟡 TopBar, SideNav)
│   ├── pages/                  (🟢 Home, Profile, Login, Signup, Friends, Landing, About, NotFound)
│   └── ui/                     (🔵 ProtectedRoute, ThemeToggle)
│
└── assets/icons/               (🔵 SVG components by category)
```

---

## 🎓 HOW TO START A STUDY SESSION

**Priority 1 (useEffect):**
> "Let's start with Priority 1 — show me the first useEffect in PostsContext.jsx"

**Priority 2 (Props):**
> "Let's start with Priority 2 — show me PostCard.jsx"

**Priority 3 (Python exceptions):**
> "Let's start with Priority 3 — show me the first try/except in posts/views.py"

**Priority 4 (Python strings):**
> "Let's start with Priority 4 — show me posts/serializers.py"

**Priority 5 (Python File I/O):**
> "Let's start with Priority 5 — drill me on file I/O syntax cold"

Use the Chunk Method. One block. Wait for "Got it?". Explain it back. Write it cold.
