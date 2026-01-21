PABLO | XL | UI LEAD + ARCHITECT + WIREFRAME
UI systems, visual design, wireframe ownership, project architecture
T-Shirt Size: XL (~35 JSX files)
Role: UI Lead, Project Architect, Visual Design, Wireframe Owner
Strengths: UI/UX, visual design, artist background, system architecture
Focus: Complex animations, charts, responsive layouts, project scaffolding

🏗️ ARCHITECT DELIVERABLES (COMPLETED)
#P-000 - Project Architecture
As the project architect, I want to scaffold the entire project structure, so that the team has files to implement.
Acceptance Criteria:

Project shell/scaffolding - initial folder structure ✅
Component shell files - all components scaffolded for team ✅
Route structure - routing architecture set up ✅
Context providers - shell context files created ✅
PROJECT-ARCHITECTURE.md documentation ✅
STUDY-PLAN.md with project tree ✅
Database fixture posts_and_users.json ✅


🔴 CRITICAL PATH
#P-001 - Wireframe Documentation ✅ DONE
As the UI lead, I want wireframe documentation, so that the team has visual references for all screens.
Acceptance Criteria:

Low-fidelity wireframes for all major screens ✅
Component hierarchy diagram ✅
User flow diagrams ✅
Responsive breakpoint sketches ✅
Design system reference (colors, spacing, typography) ✅

Files: docs/wireframe-prompt/NUMENEON-WIREFRAME-GUIDE.md

#P-002 - App.jsx Main Routing & Layout
As a user, I want consistent navigation across all pages, so that I can move through the app easily.
Acceptance Criteria:

Main routing configuration
Protected route wrappers
Layout structure wrapping all pages
Route definitions for all pages

Files: src/App.jsx
Est. Hours: 2h

#P-003 - TopBar Component
As a user, I want a navigation header, so that I can access search, notifications, and my profile.
Acceptance Criteria:

Logo/brand link to home
Search trigger button
Notification trigger button
User menu dropdown
Responsive behavior (mobile/desktop)

Files: src/components/TopBar/
Est. Hours: 3h

#P-004 - SideNav Component
As a user, I want desktop navigation, so that I can quickly access main sections.
Acceptance Criteria:

Navigation links (Home, Profile, Messages)
Active state highlighting
Collapse/expand behavior
Hidden on mobile

Files: src/components/SideNav/
Est. Hours: 2h

📱 HOME PAGE SYSTEM
#P-005 - Home.jsx Main Feed Page
As a user, I want a home feed page, so that I can see posts from people I follow.
Acceptance Criteria:

✅✅✅✅✅✅✅✅✅✅

Page container with layout
Fetches posts on mount
Loading and error states
Empty state for no posts

Files: src/pages/Home/
Dependencies: Colin's PostsContext
Est. Hours: 3h
✅✅✅✅✅✅✅✅✅✅


#P-006 - TimelineRiverFeed Container
As a user, I want posts grouped in a river layout, so that I can browse by author.
Acceptance Criteria:

Container for all river rows
Receives grouped posts data
Handles scroll behavior
Responsive 3-column layout

Files: src/components/TimelineRiver/TimelineRiverFeed.jsx
Dependencies: P-015 (groupPosts.js)
Est. Hours: 4h

#P-007 - TimelineRiverRow Orchestrator
As a user, I want each author's posts in a horizontal lane, so that I can scroll through their content.
Acceptance Criteria:

Per-user horizontal lane
Author avatar and name header
Contains SmartDeck carousel
Handles row-level interactions

Files: src/components/TimelineRiver/TimelineRiverRow.jsx
Dependencies: P-006
Est. Hours: 5h

#P-008 - PostCard Component
As a user, I want to see individual posts, so that I can read and interact with content.
Acceptance Criteria:

Post content display (text, media)
Author info (avatar, name, timestamp)
Action buttons (like, comment, repost)
Click to expand thread
Edit/delete for own posts

Files: src/components/PostCard/
Dependencies: Colin's PostsContext
Est. Hours: 4h

#P-009 - SmartDeck Carousel System
As a user, I want to swipe through posts, so that I can browse multiple posts from one person.
Acceptance Criteria:

Touch/swipe navigation
Mouse drag support
Dot indicators for position
Smooth transitions
Lazy loading for performance

Files: src/components/SmartDeck/
Est. Hours: 5h

#P-010 - ThreadView Replies Display
As a user, I want to see replies inline, so that I can follow conversations.
Acceptance Criteria:

Expandable reply list
Nested reply display
Reply count indicator
Collapse/expand toggle

Files: src/components/ThreadView/
Est. Hours: 3h

#P-011 - MobileTabNav Category Tabs
As a mobile user, I want category tabs, so that I can filter content types.
Acceptance Criteria:

Tab bar component
Category options (All, Following, etc.)
Active state styling
Sticky positioning

Files: src/components/MobileTabNav/
Est. Hours: 2h

#P-012 - RepostModal Share Options
As a user, I want to repost content, so that I can share posts with my followers.
Acceptance Criteria:

Modal with share options
Repost with/without comment
Copy link option
Share to external (stretch)

Files: src/components/RepostModal/
Est. Hours: 2h

#P-013 - MediaLightbox Image Viewer
As a user, I want to view images fullscreen, so that I can see media in detail.
Acceptance Criteria:

Fullscreen overlay
Zoom controls
Swipe between images
Close button/escape key

Files: src/components/MediaLightbox/
Est. Hours: 3h

#P-014 - DeleteConfirmModal
As a user, I want a confirmation before deleting, so that I don't accidentally remove content.
Acceptance Criteria:

Confirmation dialog
Cancel/confirm buttons
Clear warning message

Files: src/components/DeleteConfirmModal/
Est. Hours: 1h

#P-015 - groupPosts.js Utility
As a developer, I want posts grouped by author, so that the river timeline displays correctly.
Acceptance Criteria:

Groups posts array by author ID
Maintains chronological order within groups
Returns format ready for TimelineRiverFeed

Files: src/utils/groupPosts.js
Est. Hours: 2h

#P-016 - timeFormatters.js Utility
As a user, I want relative timestamps, so that I know how recent posts are.
Acceptance Criteria:

Relative time ("2h ago", "yesterday")
Absolute fallback for old posts
Consistent formatting

Files: src/utils/timeFormatters.js
Est. Hours: 0.5h

👤 PROFILE PAGE SYSTEM
#P-017 - Profile.jsx Main Page
As a user, I want to view profiles, so that I can see user info and their posts.
Acceptance Criteria:

Page container with layout
Fetches user profile data
Contains ProfileCard and TimelineRiver
Loading and error states

Files: src/pages/Profile/
Dependencies: Natalia's AuthContext
Est. Hours: 4h

#P-018 - ProfileCard Container
As a user, I want a flippable profile card, so that I can see info and stats.
Acceptance Criteria:

Container for front/back cards
Flip trigger button
Maintains flip state
Smooth 3D transition

Files: src/components/ProfileCard/ProfileCard.jsx
Est. Hours: 3h

#P-019 - ProfileCardFront
As a user, I want to see basic profile info, so that I know who the user is.
Acceptance Criteria:

Avatar display
Display name and username
Bio text
Stats (posts, followers, following)
Follow/edit button

Files: src/components/ProfileCard/ProfileCardFront.jsx
Est. Hours: 4h

#P-020 - ProfileCardBack + Flip Animation
As a user, I want to see detailed stats on card back, so that I can view activity data.
Acceptance Criteria:

3D CSS flip animation
Back card content
Activity charts container
Flip back button

Files: src/components/ProfileCard/ProfileCardBack.jsx
Est. Hours: 5h

#P-021 - ActivityVisualization Charts
As a user, I want to see activity charts, so that I can track engagement over time.
Acceptance Criteria:

Wave chart (activity over time)
Heatmap (posting frequency)
Donut chart (content breakdown)
Canvas-based rendering
Responsive sizing

Files: src/components/ActivityVisualization/
Est. Hours: 6h

#P-022 - TimelineRiver Profile Version
As a user, I want to see my posts on my profile, so that I can review my content.
Acceptance Criteria:

Profile-specific river layout
Single user's posts only
Integrates with profile page

Files: src/components/River/TimelineRiver.jsx
Est. Hours: 4h

#P-023 - RiverSmartDeck
As a user, I want carousel navigation on profile posts, so that I can browse my content.
Acceptance Criteria:

Profile-specific carousel
Consistent with home SmartDeck
Adapted for single-user view

Files: src/components/River/RiverSmartDeck.jsx
Est. Hours: 3h

#P-024 - RiverPostActions
As a user, I want action buttons on profile posts, so that I can interact with content.
Acceptance Criteria:

Like button with count
Comment button with count
Repost button with count
Edit/delete for own posts

Files: src/components/River/RiverPostActions.jsx
Est. Hours: 2h

#P-025 - RiverFeedView
As a user, I want a feed view mode on profile, so that I can see posts in list format.
Acceptance Criteria:

Vertical list layout
Alternative to timeline view
Toggle between views

Files: src/components/River/RiverFeedView.jsx
Est. Hours: 3h

#P-026 - RiverComposer
As a user, I want to compose posts from my profile, so that I can create content in context.
Acceptance Criteria:

Inline composer component
Text input with character count
Triggers ComposerModal for full editor

Files: src/components/River/RiverComposer.jsx
Est. Hours: 3h

#P-027 - RiverTimelineView
As a user, I want a timeline view on profile, so that I can see posts chronologically.
Acceptance Criteria:

Chronological post display
Date separators
Alternative to feed view

Files: src/components/River/RiverTimelineView.jsx
Est. Hours: 3h

#P-028 - RiverThread
As a user, I want to expand threads on profile, so that I can see full conversations.
Acceptance Criteria:

Thread expansion inline
Reply display
Collapse functionality

Files: src/components/River/RiverThread.jsx
Est. Hours: 2h

#P-029 - ComposerModal
As a user, I want a full-screen composer, so that I can write posts without distractions.
Acceptance Criteria:

Portal-based full-page overlay
Text input with character count
Media upload preview
Post submission to API
Close/cancel handling
Loading state during submission

Files: src/components/ComposerModal/
Dependencies: Colin's PostsContext
Est. Hours: 4h

🔍 MODALS & OVERLAYS
#P-030 - MessageModal (DMs)
As a user, I want to send DMs, so that I can have private conversations.
Acceptance Criteria:

Modal overlay
Conversation list
Message thread view
Send message input
Friend selection

Files: src/components/MessageModal/
Dependencies: Crystal's FriendsContext
Est. Hours: 5h

#P-031 - SearchModal
As a user, I want to search users and posts, so that I can discover content.
Acceptance Criteria:

Modal overlay
Search input with debounce
Results tabs (users, posts)
Result item display
Recent searches (stretch)

Files: src/components/SearchModal/
Dependencies: Tito's apiClient
Est. Hours: 4h

#P-032 - NotificationModal
As a user, I want to see notifications, so that I know when people interact with my content.
Acceptance Criteria:

Modal overlay
Notification list
Notification types (like, comment, follow, repost)
Mark as read
Empty state

Files: src/components/NotificationModal/
Dependencies: Tito's apiClient
Est. Hours: 3h

📄 OTHER PAGES
#P-033 - Landing.jsx
As a visitor, I want a landing page, so that I understand NUMENEON before signing up.
Acceptance Criteria:

Marketing/splash content
Feature highlights
CTA to signup/login
Cyberpunk aesthetic

Files: src/pages/Landing/
Est. Hours: 2h

#P-034 - About.jsx
As a user, I want an about page, so that I can learn about the platform.
Acceptance Criteria:

Platform description
Team info (stretch)
Contact/links

Files: src/pages/About/
Est. Hours: 1h

#P-035 - NotFound.jsx (404)
As a user, I want a 404 page, so that I know when a page doesn't exist.
Acceptance Criteria:

Error message
Link back to home
Consistent styling

Files: src/pages/NotFound/
Est. Hours: 0.5h

🎨 CONTEXTS
#P-036 - MessageContext.jsx
As a developer, I want DM state management, so that messages persist across components.
Acceptance Criteria:

Conversations state
Active conversation state
Send message function
Fetch conversations function
Mark as read function

Files: src/contexts/MessageContext.jsx
Dependencies: Tito's apiClient
Est. Hours: 3h

#P-037 - SearchContext.jsx
As a developer, I want search state management, so that search persists across components.
Acceptance Criteria:

Search query state
Search results state
Search function with debounce
Clear search function

Files: src/contexts/SearchContext.jsx
Dependencies: Tito's apiClient
Est. Hours: 2h

📊 SUMMARY
SectionTasksEst. HoursCritical PathP-001 to P-0047h (1 done)Home Page SystemP-005 to P-01633.5hProfile Page SystemP-017 to P-02946hModals & OverlaysP-030 to P-03212hOther PagesP-033 to P-0353.5hContextsP-036 to P-0375hTOTAL37 tasks~107h

🔗 DEPENDENCIES
Pablo PROVIDES:

All UI components (team integrates)
Design system (SCSS variables, mixins)
Icon system
Wireframe documentation
Project shell/scaffolding

Pablo CONSUMES:

AuthContext (Natalia) - user state for profiles
PostsContext (Colin) - posts data for feeds
FriendsContext (Crystal) - friends for DMs
ThemeContext (Tito) - theme state
apiClient (Tito) - HTTP requests


🎨 KEY COMPLEXITY AREAS

3D Flip Animation - ProfileCard front/back with CSS transforms
Carousel System - SmartDeck with touch/swipe support
Canvas Charts - Wave, Heatmap, Donut visualizations
Timeline River - 3-column responsive layout with grouping
Thread Expansion - Inline reply display with edit/delete
Full-page Composer - Portal-based overlay with media preview

