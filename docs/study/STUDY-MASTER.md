# NUMENEON STUDY MASTER PLAN — V2: MASTER STUDY EDITION

## 🧠 HOW TO TEACH PABLO

- Analogy before syntax, every time — no exceptions
- Big picture before parameters — never jump into details before the concept is clear
- When two terms mean the same thing, say so explicitly: "these are the same thing, different word"
- One concept at a time — stop and wait for confirmation before moving on
- Short responses only — no walls of text
- Inline code comments only, not separate prose explanations after the block
- When Pablo says "confused" — stop immediately, go back one level, find a new analogy, never push forward
- When Pablo pushes back — rephrase, don't defend the explanation
- Flag system — when Pablo says "flag this", mark it for revisit later in the session
- Cold rebuild = write the flow chain, not code from scratch
- If two terms appear that mean the same thing — always introduce them together so Pablo can build associations

---

## 🎯 MISSION

Score 90+ on the next IKM assessment. Explain every part of NUMENEON in an interview without notes. Write small patterns cold.

**IKM score was 70. Graduation Feb 2026. Gaps identified. Now fixing them.**

**Old approach failed because:** AI jumped around, variables appeared out of nowhere, no structure for retention.

**New approach:** 5-Stage Master Study — copy, annotate, compare, synthesize, rebuild cold.

---

## 👤 WHO I AM

Pablo — UI Lead on NUMENEON, 45, career changer, GA grad Feb 2026.
Visual/spatial thinker. Synesthesia. Martial arts background — kata (correct repetition) over cramming.
Built the entire frontend. Know my own code better than abstract trivia.

**Strengths:** Visual/spatial · Pattern recognition · UI/UX background · Built the whole frontend
**Gaps:** Python syntax · Abstract React patterns I haven't used · Writing from scratch

**Stack:** React 18 + Vite + Context API + Axios (frontend) · Django 5.2 + DRF + JWT + Channels + WebSockets + Redis (backend) · Deployed on Render

---

## 🗂️ PROJECT FILE TREE

Use this map to trace connections. When a variable appears in a component, trace it up this tree to find where it was born.

### Frontend (`frontend/src/`)

```
main.jsx                          ← entry point, all 10 providers wrap here
App.jsx                           ← routing, ProtectedRoute, layout

contexts/
  AuthContext.jsx                 ← login/logout, currentUser, JWT storage
  PostsContext.jsx                ← posts array, CRUD functions, collapsedDecks
  FriendsContext.jsx              ← friends list, friend requests
  MessageContext.jsx              ← DM conversations
  NotificationContext.jsx         ← in-app + push notification state
  WebSocketContext.jsx            ← WS connection, subscribe/route events
  StoriesContext.jsx              ← stories data + viewed tracking
  SearchContext.jsx               ← search modal open/close + results
  SideNavContext.jsx              ← mobile sidebar open/close
  ThemeContext.jsx                ← dark/light mode

services/
  apiClient.js                    ← Axios instance, JWT interceptors — ALL requests go through here
  authService.js                  ← login, signup, getCurrentUser
  postsService.js                 ← posts CRUD, like, delete
  friendsService.js               ← send/accept/decline requests, list friends
  messagesService.js              ← conversations, messages
  usersService.js                 ← profile fetch, search users
  storiesService.js               ← create/view/react to stories
  myStudioService.js              ← MyStudio profile, playlist
  studioSpaceService.js           ← StudioSpace data
  pushService.js                  ← push notification subscription

components/
  ui/
    ProtectedRoute.jsx            ← auth guard, redirects to login if not authenticated
    Stories/StoryUploadModal.jsx
    Stories/StoryViewer.jsx
    PostDetailModal/PostDetailModal.jsx

  layout/
    TopBar/TopBar.jsx             ← notification bell, messages icon, search, daily widget
    TopBar/NotificationModal/NotificationModal.jsx
    TopBar/MessageModal/MessageModal.jsx
    TopBar/SearchModal/SearchModal.jsx
    SideNav/SideNav.jsx           ← mobile side navigation

  pages/
    Login/Login.jsx               ← email login form
    Signup/Signup.jsx             ← registration form
    Landing/Landing.jsx           ← public landing page
    NotFound/NotFound.jsx         ← 404 page

    Home/
      Home.jsx                    ← main feed page, renders TimelineRiverFeed
      utils/groupPosts.js         ← groupPostsByUser(), sortGroupedPosts() — River Timeline algorithm
      utils/timeFormatters.js
      components/
        TimelineRiverFeed/TimelineRiverFeed.jsx   ← splits posts into user rows
        TimelineRiverRow/TimelineRiverRow.jsx     ← one user's row, 3 tabs (thoughts/media/milestones)
        TimelineRiverRow/components/
          PostCard/PostCard.jsx                   ← individual post card (stateless)
          SmartDeck/SmartDeck.jsx                 ← animated card stack
          ThreadView/ThreadView.jsx               ← reply thread
          ReactionPicker/ReactionPicker.jsx
          MobileTabNav/MobileTabNav.jsx

    Profile/
      Profile.jsx                 ← user profile page
      components/
        ComposerModal/ComposerModal.jsx           ← post creation form (used on profile & home)
        ProfileCard/ProfileCard.jsx               ← flip card with stats
        ProfileCard/components/
          ProfileCardFront/ProfileCardFront.jsx
          ProfileCardBack/ProfileCardBack.jsx
          ActivityVisualization/ActivityVisualization.jsx
          EditProfileModal/EditProfileModal.jsx
          AvatarUploadModal/AvatarUploadModal.jsx
        TimelineRiver/TimelineRiver.jsx           ← profile-specific river layout
        TimelineRiver/components/
          RiverFeedView/RiverFeedView.jsx
          RiverSmartDeck/RiverSmartDeck.jsx
          RiverComposer/RiverComposer.jsx
          RiverThread/RiverThread.jsx

    Friends/Friends.jsx           ← friend requests, suggestions, friends list
    MyStudio/MyStudio.jsx         ← personal profile: music, theme, top 8 friends
    MyStudio/components/
      MusicPlayer/MusicPlayer.jsx
      ThemePicker/ThemePicker.jsx
      Top8Friends/Top8Friends.jsx
      ProfileSection/ProfileSection.jsx
    Learn/Learn.jsx               ← educational content page
    About/About.jsx
```

### Backend (`backend/` — separate repo)

```
numeneon/
  settings.py     ← CORS, JWT config, INSTALLED_APPS, Channels, VAPID, Redis
  urls.py         ← root URL router — routes to each app's urls.py
  asgi.py         ← HTTP→Django, WS→JWTMiddleware→URLRouter

posts/
  models.py       ← Post (type: thoughts/media/milestones, parent FK for replies), Like
  serializers.py  ← PostSerializer: is_liked (computed), author (nested UserSerializer)
  views.py        ← PostViewSet: list/create/destroy + @action like(), toggle_collapse()
  urls.py

users/
  models.py       ← User (email-based), Profile (OneToOne with User)
  serializers.py  ← UserSerializer, ProfileSerializer, EmailLoginSerializer
  views.py        ← email_login() (JWT), get_me(), update_profile(), search_users()
  signals.py      ← auto-creates Profile when User is saved (post_save signal)
  urls.py

friends/
  models.py       ← FriendRequest (sender/receiver), Friendship (2 rows per friendship)
  serializers.py  ← FriendshipSerializer, FriendRequestSerializer
  views.py        ← send_request(), accept_request(), decline_request(), list_friends()
  urls.py

notifications/
  models.py       ← PushSubscription (endpoint, p256dh, auth keys)
  consumers.py    ← NotificationConsumer: connect/receive/disconnect (WebSocket handler)
  middleware.py   ← JWTAuthMiddleware: extracts JWT from ?token= query string
  utils.py        ← notify_user(), notify_friend_request(), send_push_notification()
  routing.py      ← maps ws/notifications/ → NotificationConsumer

messages_app/
  models.py       ← Message (sender, receiver, is_read, optional reply_to_story)
  serializers.py  ← MessageSerializer
  views.py        ← conversations list, per-user thread, mark-all-read
  urls.py

mystudio/
  models.py       ← MySpaceProfile (OneToOne User), PlaylistSong (max 5, ordered)
  serializers.py
  views.py        ← profile CRUD, song search, playlist add/remove/reorder
  deezer_utils.py ← iTunes (primary) + Deezer (fallback) for song previews
  urls.py

stories/
  models.py       ← Story (UUID PK, 24hr expiry), StoryView, StoryReaction
  serializers.py
  views.py        ← create/list/delete, view tracking, react/unreact
  urls.py

seed_posts.py     ← populates database with mock posts (File I/O study target)
```

---

## 🧠 THE METHOD: 5-STAGE MASTER STUDY

Every chunk goes through these stages in order. AI always goes first — you cannot annotate what you don't understand yet.

| Stage | Name        | What happens                                                    | Who     |
| ----- | ----------- | --------------------------------------------------------------- | ------- |
| 1     | **Show**    | AI shows the chunk WITH full inline comments already in it      | AI      |
| 2     | **Copy**    | I retype the commented chunk exactly — no shortcuts             | Me      |
| 3     | **Recall**  | I close it and rewrite the comments from memory in my own words | Me      |
| 4     | **Compare** | I share what I wrote — AI shows what I missed or got wrong      | Me + AI |
| 5     | **Rebuild** | I write the whole chunk cold — no comments, no reference        | Me      |

### What this looks like in practice

1. I say `"Flow: login"` or `"I need to study"`
2. AI shows Chunk 1 of the flow — full code with inline comments explaining every line
3. I copy it (builds pattern memory — like tracing a drawing before you draw freehand)
4. I close it, rewrite the comments from memory
5. I paste what I wrote back — AI tells me what I nailed and what I missed
6. When I've done all chunks in the flow, I write the whole flow chain cold
7. We move to the next flow

**Rule:** AI shows commented code first. Always. No raw code drops, no questions first, no quizzes before the material.
**Rule:** One chunk per response. Never move to the next chunk until I say "next."

---

## 🗓️ SESSION MENU

**DEFAULT: If I say "I don't know" or "just start" or "I need to study" — AI immediately starts Flow 1, Step 1. Show the first chunk of Login.jsx with no comments. No questions. Just the code.**

| Type                   | Command                                      | What it does                                                       |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| **A — File Study**     | `"File Study: [filename]"`                   | Work through a file chunk by chunk (Stages 1–4)                    |
| **B — Bridge Trace**   | `"Trace: [variable name]"`                   | Follow a variable from frontend all the way back to backend origin |
| **C — Cold Rebuild**   | `"Cold Rebuild: [pattern/file]"`             | Stage 5 solo — write it without looking                            |
| **D — Syntax Drill**   | `"Drill: [topic]"`                           | Quick-fire Python or React syntax, no file needed                  |
| **E — Flow Map**       | `"Flow: [login/like/post/delete/websocket]"` | Narrate a full data flow like an interview answer                  |
| **F — Interview Prep** | `"Interview me: [topic]"`                    | AI plays interviewer, asks questions about my codebase             |

---

## 🏰 THE CHAIN OF COMMAND

Data flows DOWN. State updates flow UP. This never changes.

```
Django Backend (Python models + serializers)
    ↓  JSON travels here (serializer converts Python objects → JSON)
apiClient.js  ← JWT token is attached to every request here
    ↓
Service files (postsService, authService, etc.)  ← raw API calls
    ↓
Context files (PostsContext, AuthContext, etc.)  ← STATE lives here
    ↓
Parent components (TimelineRiverFeed → TimelineRiverRow)  ← ORCHESTRATORS
    ↓
Child components (PostCard, SmartDeck, etc.)  ← what the user SEES
```

**Rule: When you see a variable in a child component, it was defined higher up the chain. Trace it UP.**

### 5 Data Flows (own these cold)

**Flow 1 — Login:**

```
Login.jsx → authService.login() → apiClient → users/views.py email_login()
→ returns {access, refresh} → AuthContext stores in localStorage
→ apiClient.get('/api/auth/me/') → users/views.py get_me()
→ returns currentUser (UserSerializer) → AuthContext.setCurrentUser()
→ App re-renders → ProtectedRoute lets user through
```

**Flow 2 — Create Post:**

```
ComposerModal.jsx → PostsContext.createPost() → postsService → apiClient
→ posts/views.py PostViewSet.create() → returns new post (PostSerializer)
→ PostsContext: setPosts(prev => [newPost, ...prev]) → feed updates at top
```

**Flow 3 — Like a Post:**

```
PostCard.jsx click → calls onLike(post.id) prop
→ prop came from PostsContext.likePost() via TimelineRiverRow
→ postsService.likePost() → apiClient → posts/views.py like() @action
→ toggles Like row → returns updated post
→ PostsContext: setPosts(prev => prev.map(p => p.id === id ? updatedPost : p))
→ PostCard re-renders with new is_liked value
```

**Flow 4 — Live Notification (WebSocket):**

```
WebSocketContext: opens WS on mount → ws://backend/ws/notifications/?token=JWT
→ notifications/middleware.py: validates JWT from query string
→ notifications/consumers.py: connect() → accept()
→ (event fires — e.g. someone sends a friend request)
→ notifications/utils.py: notify_user() → channel_layer.group_send()
→ consumers.py: receive() → sends WS message to frontend
→ WebSocketContext: routes message by type
→ NotificationContext: addNotification() → badge count updates
```

**Flow 5 — Delete Post:**

```
PostCard.jsx click → calls onDelete(post.id)
→ PostsContext.deletePost() → postsService → apiClient
→ posts/views.py PostViewSet.destroy() → returns 204 No Content
→ PostsContext: setPosts(prev => prev.filter(p => p.id !== postId))
→ post disappears from UI
```

---

## 🔌 THE FRONTEND-BACKEND BRIDGE

**This is the answer to "why am I seeing variables I didn't write in the frontend?"**

Any field you see on a `post`, `user`, or `friend` object in JSX was **built by a serializer on the backend** and traveled to the frontend as JSON.

### The Journey of `is_liked` (use this as a template for tracing any variable)

```
posts/models.py      →  The Like model exists. A row = user liked that post.
posts/serializers.py →  is_liked = SerializerMethodField()
                        def get_is_liked(self, obj): checks if request.user liked obj
                        NOW is_liked is part of every post object sent as JSON
apiClient.js         →  receives the JSON. post object has is_liked: true/false.
postsService.js      →  returns response.data (post object with is_liked included)
PostsContext.jsx     →  setPosts(data) — each post in the array has is_liked on it
TimelineRiverRow.jsx →  passes post as prop down to PostCard
PostCard.jsx         →  const { is_liked } = post  ← destructured FROM the post object
                        looks like a local variable but it was born in the serializer
```

### Variable Origin Map

| Variable                      | Where you see it in JSX   | Where it was BORN              | How it got there                                 |
| ----------------------------- | ------------------------- | ------------------------------ | ------------------------------------------------ |
| `post.is_liked`               | PostCard.jsx              | `posts/serializers.py`         | Computed SerializerMethodField                   |
| `post.author.profile_picture` | PostCard.jsx              | `users/serializers.py`         | Nested UserSerializer inside PostSerializer      |
| `post.parent`                 | replies                   | `posts/models.py`              | ForeignKey to self — included in PostSerializer  |
| `currentUser`                 | AuthContext, PostsContext | `users/serializers.py`         | JWT decode → /auth/me/ → UserSerializer          |
| `token`                       | apiClient.js interceptor  | `users/views.py email_login()` | JWT, stored in localStorage by AuthContext       |
| `notifications`               | NotificationContext       | `notifications/utils.py`       | WebSocket event via channel_layer                |
| `post.target_profile_id`      | PostsContext, Profile.jsx | `posts/serializers.py`         | Wall post field — null for feed, set for profile |

### What to do when you see an unknown variable

1. **Is it a prop?** → Look at the parent component that passes it down
2. **Is it from a context?** → Find the `use[Context]()` call at the top of the file
3. **Is it on a data object (`post.X`, `user.X`)?** → Go to the serializer that built that object
4. **Is it in `localStorage`?** → Look at AuthContext — it stores and retrieves tokens

---

## 📚 JARGON GLOSSARY

When AI uses any of these words without explaining first — stop and ask for the definition.

### React / Frontend

| Word                    | Plain English                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| **State**               | Data a component remembers and can change. Changing it triggers a re-render.             |
| **Props**               | Data passed FROM parent TO child. Read-only in the child.                                |
| **Context**             | A shared "room" any component can walk into and grab data from.                          |
| **Provider**            | The "Russian doll wrapper" that makes context available to everything inside it.         |
| **Hook**                | A function starting with `use`. Connects functional components to React features.        |
| **Destructuring**       | Pulling specific values out of an object. `const { name } = user` — same as `user.name`. |
| **Render**              | React drawing the component on screen. Happens when state or props change.               |
| **Mount / Unmount**     | Mount = component appears. Unmount = component disappears.                               |
| **useEffect**           | "Run this code after render." Cleanup return = run code on unmount.                      |
| **Dependency array**    | The `[]` at end of useEffect. Empty = run once. `[value]` = run when value changes.      |
| **Async/await**         | "Wait for this to finish before moving on." Used for API calls.                          |
| **Interceptor**         | Code that runs automatically before/after EVERY request — like a tollbooth.              |
| **Stateless component** | No `useState`. Just receives props and displays them.                                    |
| **Prop drilling**       | Passing props through many layers just to reach a deep child. Context solves this.       |

### Python / Backend

| Word              | Plain English                                                                           |
| ----------------- | --------------------------------------------------------------------------------------- |
| **Serializer**    | Converts Python objects → JSON (out to frontend) and JSON → Python (in from frontend).  |
| **ViewSet**       | Class handling all CRUD for one model. get, post, put, delete in one place.             |
| **Queryset**      | A filterable list of database rows. Like an array of model objects you can `.filter()`. |
| **Model**         | Python class that defines one database table. Each attribute = one column.              |
| **Signal**        | Auto-runs code when something happens. `post_save` = triggers when a row is saved.      |
| **Middleware**    | Code that runs before/after every request at the server level.                          |
| **@action**       | Custom endpoint added to a ViewSet beyond normal CRUD. e.g. `/posts/:id/like/`          |
| **ForeignKey**    | A link between two tables. "This post belongs to this user."                            |
| **JWT**           | A signed token proving "I am user X." Sent in Authorization header on every request.    |
| **Consumer**      | WebSocket equivalent of a View. Handles connect, receive, disconnect.                   |
| **Channel Layer** | Redis system that lets the backend push messages to connected frontend users.           |

---

## 🔴 IKM PRIORITY GAPS (These are what I got wrong — fix these first)

### Gap 1 — React useEffect Cleanup

**What failed:** Didn't know the cleanup return pattern. Memory leak question was a blind spot.

```jsx
useEffect(() => {
  // MOUNT: runs when component appears
  const subscription = something.subscribe();

  return () => {
    // UNMOUNT: runs when component disappears
    // WITHOUT THIS: subscription keeps running even after component is gone = MEMORY LEAK
    subscription.unsubscribe();
  };
}, []); // [] = run once on mount, cleanup runs on unmount
```

**Rule:** `[]` = runs once. `[value]` = runs when value changes. No array = runs every render.
**Study files:** `WebSocketContext.jsx` → `PostsContext.jsx`

---

### Gap 2 — React Props / Stateless Components

**What failed:** Render Props pattern. Picked server-side instead of React Router for 404 catch-all.

```jsx
// Stateless component — no useState, just receives and displays
function PostCard({ post, onLike, onDelete }) {
  // post = data passed down from TimelineRiverRow
  // onLike = function defined in PostsContext, passed down as a prop
  return <div onClick={() => onLike(post.id)}>{post.content}</div>;
}
```

**React Router catch-all (burned me once):**

```jsx
// path="*" = matches anything not already matched. Goes LAST.
<Route path="*" element={<NotFound />} />
// If question says "in a React app" → answer is React Router, NOT nginx or server config
```

**Study files:** `PostCard.jsx` → `ProtectedRoute.jsx`

---

### Gap 3 — Python Exception Handling

**What failed:** Fake exceptions (TupleError, PythonError, FileError, ListError) fooled me.

```python
TypeError          # wrong type (gave string where int expected)
KeyError           # dict key doesn't exist
ValueError         # right type, wrong value
IndexError         # list index out of range
AttributeError     # object has no such attribute
FileNotFoundError  # file doesn't exist
Exception          # catches everything — last resort only

# FAKE (do not exist): TupleError, PythonError, FileError, ListError

# Django-specific (real):
User.DoesNotExist  # model .get() found nothing

# sys TRAP: sys.copy() does not exist
# sys is only for: sys.exit(), sys.argv, sys.path
```

**Study files:** `posts/views.py` → `users/views.py`

---

### Gap 4 — Python String Formatting

**What failed:** `%s` vs `%r` — didn't know the difference.

```python
f"Hello {name}"         # MODERN — inserts value directly — use this
"Hello %s" % name       # OLD — converts to string (same result as f-string)
"Value is %r" % value   # DEBUG — repr format, keeps quotes: "Value is 'pablo'"

# .append() trick — returns None, NOT the list
my_list = [1, 2]
result = my_list.append(3)  # my_list is [1, 2, 3] but result is None
```

---

### Gap 5 — Python File I/O + sys module

**What failed:** `readline()` vs `readlines()` unclear. `sys` module purpose unclear.

```python
with open('file.txt', 'r') as f:  # 'r' = read, 'w' = write (overwrites), 'a' = append
    one_line = f.readline()       # reads ONE line — singular
    all_lines = f.readlines()     # reads ALL lines into a list — plural

import sys
sys.argv   # list of command-line arguments
sys.exit() # quit the program
sys.path   # list of places Python looks for modules
# sys is SYSTEM stuff, not file content — input() reads from terminal, not files
```

---

## 📋 STUDY ORDER — FLOW FIRST

Study by flow, not by file. Each flow is one continuous thread — you follow where the data goes.
Every file visit has a reason: it's the next step in the same story.

**Rule: finish one flow completely before starting the next.**
**Rule: if a variable appears you don't recognize, call a Bridge Trace before moving on.**

---

### Flow 1 — Login (start here — covers auth, JWT, ProtectedRoute)

**Files touched, in order:**

1. `Login.jsx` — the form. What happens on submit?
2. `contexts/AuthContext.jsx` — where does the login function live? What state does it set?
3. `services/authService.js` — what API call does it make?
4. `services/apiClient.js` — how does the JWT get stored and attached to future requests?
5. `users/views.py` — backend: `email_login()` — what does it return?
6. `users/serializers.py` — what does the user object look like when it comes back?
7. `components/ui/ProtectedRoute.jsx` — how does the app know you're logged in?

**Gaps covered:** Gap 2 (props/auth guard) · JWT interceptors · useEffect in AuthContext

---

### Flow 2 — Like a Post (covers props, context, serializer bridge)

**Files touched, in order:**

1. `PostCard.jsx` — where does the click happen? What prop is called?
2. `TimelineRiverRow.jsx` — where did that prop come from? Who passed it down?
3. `contexts/PostsContext.jsx` — where is `likePost()` defined? How does it update state?
4. `services/postsService.js` — what API call does it make?
5. `services/apiClient.js` — same interceptor, now you recognize it
6. `posts/views.py` — backend: `like()` `@action` — what does it do to the database?
7. `posts/serializers.py` — where is `is_liked` built? How does it come back on the post object?
8. `posts/models.py` — what is the `Like` model? What does a row represent?

**Gaps covered:** Gap 1 (useEffect in PostsContext) · Gap 2 (stateless PostCard, props) · Gap 3 (@action, try/except) · Variable origin of `is_liked`

---

### Flow 3 — Create a Post (covers form state, optimistic update pattern)

**Files touched, in order:**

1. `ComposerModal.jsx` — how does the form work? What state does it own?
2. `contexts/PostsContext.jsx` — `createPost()` — how is the new post added to the array?
3. `services/postsService.js` — the API call
4. `posts/views.py` — `PostViewSet.create()` — what does Django do?
5. `posts/serializers.py` — what fields come back on the new post?
6. `posts/models.py` — what are the 3 post types? What is `parent` for?

**Gaps covered:** Gap 3 (try/except in create) · `setPosts(prev => [newPost, ...prev])` pattern

---

### Flow 4 — Live Notification (covers WebSocket, useEffect cleanup, real-time)

**Files touched, in order:**

1. `contexts/WebSocketContext.jsx` — how is the WS connection opened? What's the cleanup return?
2. `numeneon/asgi.py` — how does Django route WS connections differently from HTTP?
3. `notifications/middleware.py` — how does the backend read the JWT from the WS query string?
4. `notifications/consumers.py` — what happens on connect / receive / disconnect?
5. `notifications/utils.py` — how does `notify_user()` push to the frontend?
6. `contexts/NotificationContext.jsx` — how does the frontend receive and store notifications?

**Gaps covered:** Gap 1 (useEffect cleanup in WebSocketContext) · real-time architecture

---

### Flow 5 — Friend Request (covers function-based views, 2-way data)

**Files touched, in order:**

1. `FriendsPage.jsx` or friends UI — what triggers the request?
2. `contexts/FriendsContext.jsx` — where does the send/accept function live?
3. `services/friendsService.js` — the API call
4. `friends/views.py` — how does accept create 2 Friendship rows?
5. `friends/models.py` — why are there 2 rows? What does FriendRequest look like vs Friendship?

**Gaps covered:** Gap 3 (try/except in function-based views) · data modeling decisions

---

### After all 5 flows — do one Cold Rebuild per flow

When you've finished a flow, close everything and write the flow as a diagram or pseudocode from memory. Not code — just the chain:

```
[component] → [context function] → [service] → [apiClient] → [backend view] → [serializer] → [back to context]
```

If you can write that chain without looking, you own the flow.

---

## ✏️ WRITE FROM SCRATCH (3 Exercise Types — do one after every 3 File Studies)

These build real independence. Goal is understanding what goes where and why — not perfect code.

### Type 1 — State + Logic (Vanilla JS)

```
Copy this prompt into the AI:

"Act as a senior JS engineer and beginner tutor.
Goal: Guide me building a small interactive app from scratch — no frameworks.
Rules:
- Define ALL jargon (state, variable, condition) BEFORE using it
- Give me ONE step at a time — wait for my attempt before continuing
- Give hints when I'm stuck, not full answers
- Code must be clean: meaningful names, small single-purpose functions
- When done: explain why this IS clean vs how messy code would look"
```

### Type 2 — DOM Manipulation (Vanilla JS)

```
Copy this prompt into the AI:

"Act as a senior JS engineer and tutor.
Goal: Guide me building a page UI using only vanilla JavaScript — no React.
Rules:
- Define before using: DOM, event listener, element, querySelector
- One step at a time — let me attempt before showing code
- Separate logic from display code (explain why)
- When done: explain what React is abstracting away from this vanilla version"
```

### Type 3 — Function Decomposition

```
Copy this prompt into the AI:

"Act as a senior engineer focused on clean, elegant code.
Goal: Help me break a behavior into small, focused, reusable functions.
Rules:
- Explain single responsibility principle BEFORE we start
- Ask me how I'd structure it before showing your answer
- Every function does ONE thing — clear purpose, clear name
- When done: show how a beginner would write this as one giant function,
  then explain why the decomposed version is better"
```

---

## ✅ CONCEPTS ALREADY MASTERED

**React:** Providers wrap children (Russian dolls) · `{children}` prop · Axios + JWT interceptors · `response.data` vs full response · Optional chaining `?.` · Conditional rendering · `useState` · `createContext` · `useContext` · Dynamic `:id` routing · Stateless components · `new ClassName()` · `super()`

**Python:** Dict keys immutable · `.append()` returns None · `input()` reads terminal · `issubclass()` · `useEffect` cleanup prevents memory leaks

**Architecture:** apiClient.js = single request funnel · Serializers build the objects JSX reads · Contexts own state · Services fetch data · Components display it

---

## 🎓 HOW TO START A SESSION

```
File Study:      "File Study: [filename]"
Bridge Trace:    "Trace: [variable name]"
Cold Rebuild:    "Cold Rebuild: [pattern/file]"
Syntax Drill:    "Drill: [topic]"
Flow Map:        "Flow: [login/like/post/delete/websocket]"
Interview Prep:  "Interview me: [topic]"
```
