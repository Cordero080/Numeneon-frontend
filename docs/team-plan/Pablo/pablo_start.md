NEXT 5:

Last done:
P-011 – Mobile category tab bar with sticky positioning
P-012 – Repost modal with copy link functionality
P-013 – Fullscreen media lightbox with zoom/swipe
P-014 – Delete confirmation dialog
P-015 – Post grouping utility for river timeline

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
