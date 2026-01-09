# Frontend Project Structure 🌳

This document shows the complete folder structure of the NUMENEON frontend application.

---

## 📁 Root Structure Overview

```
frontend/
├── public/              # Static assets served as-is
├── src/                 # All source code lives here
├── eslint.config.js     # Linting rules
├── index.html           # Entry HTML file
├── jsconfig.json        # JS configuration for IDE
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite bundler configuration
└── README.md            # Frontend-specific docs
```

---

## 🗂️ Complete File Tree

```
frontend/
├── public/
│   └── vite.svg
│
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   │   ├── actions.jsx        # Action-related icons (edit, delete, etc.)
│   │   │   ├── analytics.jsx      # Analytics/stats icons
│   │   │   ├── engagement.jsx     # Engagement icons (likes, comments)
│   │   │   ├── index.js           # Icon exports barrel file
│   │   │   ├── media.jsx          # Media icons (images, video)
│   │   │   ├── messaging.jsx      # Messaging icons
│   │   │   ├── misc.jsx           # Miscellaneous icons
│   │   │   ├── navigation.jsx     # Navigation icons
│   │   │   ├── profile.jsx        # Profile-related icons
│   │   │   ├── sidenav.jsx        # Side navigation icons
│   │   │   ├── ui.jsx             # General UI icons
│   │   │   └── user.jsx           # User-related icons
│   │   └── icons.jsx              # Legacy icons file
│   │
│   ├── components/
│   │   ├── layout/                # Layout components (always visible)
│   │   │   ├── SideNav/           # Left sidebar navigation
│   │   │   │   ├── index.js
│   │   │   │   ├── SideNav.jsx
│   │   │   │   └── SideNav.scss
│   │   │   │
│   │   │   └── TopBar/            # Top navigation bar
│   │   │       ├── MessageModal/  # DM messaging modal
│   │   │       │   ├── styles/    # Modular SCSS styles
│   │   │       │   │   ├── _animations.scss
│   │   │       │   │   ├── _chat.scss
│   │   │       │   │   ├── _composer.scss
│   │   │       │   │   ├── _conversations.scss
│   │   │       │   │   ├── _header.scss
│   │   │       │   │   ├── _light-mode.scss
│   │   │       │   │   ├── _overlay.scss
│   │   │       │   │   └── _responsive.scss
│   │   │       │   ├── MessageModal.jsx
│   │   │       │   └── MessageModal.scss
│   │   │       │
│   │   │       ├── NotificationModal/
│   │   │       │   ├── index.js
│   │   │       │   ├── NotificationModal.jsx
│   │   │       │   └── NotificationModal.scss
│   │   │       │
│   │   │       ├── SearchModal/
│   │   │       │   ├── index.js
│   │   │       │   ├── SearchModal.jsx
│   │   │       │   └── SearchModal.scss
│   │   │       │
│   │   │       ├── index.js
│   │   │       ├── TopBar.jsx
│   │   │       └── TopBar.scss
│   │   │
│   │   ├── pages/                 # Route-based page components
│   │   │   ├── About/
│   │   │   │   ├── About.jsx
│   │   │   │   ├── About.scss
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Friends/
│   │   │   │   ├── Friends.jsx
│   │   │   │   ├── Friends.scss
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Home/              # Main feed page
│   │   │   │   ├── components/
│   │   │   │   │   ├── DeleteConfirmModal/
│   │   │   │   │   │   ├── DeleteConfirmModal.jsx
│   │   │   │   │   │   └── DeleteConfirmModal.scss
│   │   │   │   │   │
│   │   │   │   │   ├── MediaLightbox/
│   │   │   │   │   │   ├── styles/
│   │   │   │   │   │   │   ├── _animations.scss
│   │   │   │   │   │   │   ├── _comments.scss
│   │   │   │   │   │   │   ├── _image.scss
│   │   │   │   │   │   │   ├── _info-panel.scss
│   │   │   │   │   │   │   ├── _light-mode.scss
│   │   │   │   │   │   │   ├── _overlay.scss
│   │   │   │   │   │   │   └── _responsive.scss
│   │   │   │   │   │   ├── MediaLightbox.jsx
│   │   │   │   │   │   └── MediaLightbox.scss
│   │   │   │   │   │
│   │   │   │   │   ├── TimelineRiverFeed/
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── TimelineRiverFeed.jsx
│   │   │   │   │   │   └── TimelineRiverFeed.scss
│   │   │   │   │   │
│   │   │   │   │   └── TimelineRiverRow/
│   │   │   │   │       ├── components/
│   │   │   │   │       │   ├── MobileTabNav/
│   │   │   │   │       │   ├── PostCard/
│   │   │   │   │       │   ├── RepostModal/
│   │   │   │   │       │   ├── SmartDeck/
│   │   │   │   │       │   ├── ThreadView/
│   │   │   │   │       │   └── index.js
│   │   │   │   │       ├── styles/
│   │   │   │   │       │   ├── _base.scss
│   │   │   │   │       │   ├── _carousel.scss
│   │   │   │   │       │   ├── _composer.scss
│   │   │   │   │       │   ├── _desktop-stack-nav.scss
│   │   │   │   │       │   ├── _light-mode.scss
│   │   │   │   │       │   ├── _post-actions.scss
│   │   │   │   │       │   ├── _post-card.scss
│   │   │   │   │       │   ├── _post-media.scss
│   │   │   │   │       │   ├── _responsive.scss
│   │   │   │   │       │   ├── _smart-deck.scss
│   │   │   │   │       │   └── _thread.scss
│   │   │   │   │       ├── index.js
│   │   │   │   │       ├── TimelineRiverRow.jsx
│   │   │   │   │       └── TimelineRiverRow.scss
│   │   │   │   │
│   │   │   │   ├── utils/
│   │   │   │   │   ├── groupPosts.js
│   │   │   │   │   └── timeFormatters.js
│   │   │   │   │
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Home.scss
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Landing/           # Public landing page
│   │   │   │   ├── index.js
│   │   │   │   ├── Landing.jsx
│   │   │   │   └── Landing.scss
│   │   │   │
│   │   │   ├── Login/
│   │   │   │   ├── index.js
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.scss
│   │   │   │
│   │   │   ├── NotFound/          # 404 page
│   │   │   │   ├── index.js
│   │   │   │   ├── NotFound.jsx
│   │   │   │   └── NotFound.scss
│   │   │   │
│   │   │   ├── Profile/           # User profile page
│   │   │   │   ├── components/
│   │   │   │   │   ├── ComposerModal/
│   │   │   │   │   │   ├── ComposerModal.jsx
│   │   │   │   │   │   ├── ComposerModal.scss
│   │   │   │   │   │   └── index.js
│   │   │   │   │   │
│   │   │   │   │   ├── ProfileCard/
│   │   │   │   │   │   ├── components/
│   │   │   │   │   │   │   ├── ActivityVisualization/
│   │   │   │   │   │   │   ├── PostTypeBreakdown/
│   │   │   │   │   │   │   ├── ProfileCardBack/
│   │   │   │   │   │   │   ├── ProfileCardFront/
│   │   │   │   │   │   │   └── QuickSettings/
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── ProfileCard.jsx
│   │   │   │   │   │   └── ProfileCard.scss
│   │   │   │   │   │
│   │   │   │   │   └── TimelineRiver/
│   │   │   │   │       ├── components/
│   │   │   │   │       │   ├── RiverComposer/
│   │   │   │   │       │   ├── RiverFeedView/
│   │   │   │   │       │   ├── RiverPostActions/
│   │   │   │   │       │   ├── RiverSmartDeck/
│   │   │   │   │       │   ├── RiverThread/
│   │   │   │   │       │   ├── RiverTimelineView/
│   │   │   │   │       │   └── index.js
│   │   │   │   │       ├── _light-mode.scss
│   │   │   │   │       ├── index.js
│   │   │   │   │       ├── TimelineRiver.jsx
│   │   │   │   │       └── TimelineRiver.scss
│   │   │   │   │
│   │   │   │   ├── index.js
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── Profile.scss
│   │   │   │
│   │   │   └── Signup/
│   │   │       ├── index.js
│   │   │       ├── Signup.jsx
│   │   │       └── Signup.scss
│   │   │
│   │   └── ui/                    # Reusable UI components
│   │       ├── ThemeToggle/
│   │       │   ├── index.js
│   │       │   ├── ThemeToggle.jsx
│   │       │   └── ThemeToggle.scss
│   │       └── ProtectedRoute.jsx
│   │
│   ├── contexts/                  # React Context providers
│   │   ├── AuthContext.jsx        # Authentication state
│   │   ├── FriendsContext.jsx     # Friends list state
│   │   ├── index.js               # Context exports
│   │   ├── MessageContext.jsx     # Messaging state
│   │   ├── PostsContext.jsx       # Posts/feed state
│   │   ├── SearchContext.jsx      # Search functionality
│   │   └── ThemeContext.jsx       # Light/dark theme
│   │
│   ├── services/                  # API service layer
│   │   ├── apiClient.js           # Base Axios config
│   │   ├── friendsService.js      # Friends API calls
│   │   └── postsService.js        # Posts API calls
│   │
│   ├── styles/                    # Global SCSS styles
│   │   ├── _animations.scss       # Keyframe animations
│   │   ├── _blobs.scss            # Decorative blob styles
│   │   ├── _buttons.scss          # Button components
│   │   ├── _cards.scss            # Card components
│   │   ├── _layout.scss           # Layout utilities
│   │   ├── _light-mode.scss       # Light theme overrides
│   │   ├── _mixins.scss           # SCSS mixins
│   │   ├── _reset.scss            # CSS reset
│   │   ├── _theme.scss            # Theme variables
│   │   ├── _typography.scss       # Font styles
│   │   ├── _utilities.scss        # Utility classes
│   │   ├── _variables.scss        # SCSS variables
│   │   └── main.scss              # Main entry point
│   │
│   ├── App.jsx                    # Root component with routes
│   └── main.jsx                   # React DOM entry point
│
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

---

## 🏗️ Architecture Overview

### Component Organization

| Folder               | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `components/layout/` | Persistent layout components (SideNav, TopBar) |
| `components/pages/`  | Route-specific page components                 |
| `components/ui/`     | Reusable UI primitives                         |

### State Management

| Context          | Manages                           |
| ---------------- | --------------------------------- |
| `AuthContext`    | User authentication, login/logout |
| `PostsContext`   | Posts, comments, likes            |
| `FriendsContext` | Friend relationships              |
| `MessageContext` | Direct messaging                  |
| `SearchContext`  | Search functionality              |
| `ThemeContext`   | Light/dark mode                   |

### Styling Convention

- Each component has a co-located `.scss` file
- Global styles live in `src/styles/`
- Partials prefixed with `_` (e.g., `_variables.scss`)
- Complex components use a `styles/` subfolder

---

## 📊 Stats

- **58 directories**
- **184 files**
- **7 page components**
- **7 context providers**
- **12 icon categories**

---

## 🧭 Key Entry Points

| File                    | Description           |
| ----------------------- | --------------------- |
| `src/main.jsx`          | Application bootstrap |
| `src/App.jsx`           | Route definitions     |
| `src/styles/main.scss`  | Global style imports  |
| `src/contexts/index.js` | All context exports   |
