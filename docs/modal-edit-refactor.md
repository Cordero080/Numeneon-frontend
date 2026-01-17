# Modal Edit & Card Click Refactor

## Overview

This refactor implements consistent UX patterns across Home and Profile pages for:

1. **Card Click** → Opens full-page expanded view with comments
2. **Edit Modal** → Dedicated edit modal (separate from comment composer)
3. **Comment Author Colors** → Author names colored by post type (thoughts/media/milestones)
4. **Icon-only Buttons** → Cancel/Save use icons instead of text
5. **Expand Button** → Inline edit forms have expand-to-modal button

---

## Files Changed

### Icons

#### 1. `frontend/src/assets/icons/actions.jsx`

**Changed:** `strokeWidth` from "2" to "1" for cleaner appearance

- `EditIcon`: strokeWidth="1"
- `TrashIcon`: strokeWidth="1"

---

### Home Page Components

#### 2. `frontend/src/components/pages/Home/components/TimelineRiverRow/TimelineRiverRow.jsx`

**Imports Added:**

```jsx
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@assets/icons";
import { createPortal } from "react-dom";
```

**State Changes:**

```jsx
// Before
const [editingPostId, setEditingPostId] = useState(null);
const [isSaving] = useState(false);

// After
const [editingPostId, setEditingPostId] = useState(null);
const [editingPostContent, setEditingPostContent] = useState("");
const [isSavingEdit, setIsSavingEdit] = useState(false);
```

**Handler Changes:**

`handleEditPost` - Now opens dedicated edit modal:

```jsx
const handleEditPost = (post) => {
  setEditingPostId(post.id);
  setEditingPostContent(post.content);
};
```

`handleCardClick` - NEW handler for opening expanded view:

```jsx
const handleCardClick = async (post) => {
  setActiveCommentPostId(post.id);
  setIsComposerFullPage(true);
  // Fetch replies if not already loaded
  if (!threadReplies[post.id]) {
    setLoadingThread(post.id);
    const result = await fetchReplies(post.id);
    if (result.success) {
      setThreadReplies((prev) => ({ ...prev, [post.id]: result.data }));
    }
    setLoadingThread(null);
  }
};
```

**PostCard Props Changes:**

- Added: `onCardClick={handleCardClick}`
- Removed: `isEditMode`, `setIsEditMode`, `editingPostId`, `setEditingPostId`, `onUpdatePost`
- Changed: `isSaving={false}` (edit mode moved to separate modal)

**JSX Added:** Edit Modal via createPortal

```jsx
{
  editingPostId &&
    createPortal(
      <div className="expanded-composer-overlay">
        <div className="expanded-composer-modal edit-mode">
          {/* Header with Edit icon and close button */}
          {/* Textarea for editing */}
          {/* Footer with CheckIcon save button */}
        </div>
      </div>,
      document.body,
    );
}
```

---

#### 3. `frontend/src/components/pages/Home/components/TimelineRiverRow/components/PostCard/PostCard.jsx`

**Props Changes:**

- Added: `onCardClick`
- Removed: `isEditMode`, `setIsEditMode`, `editingPostId`, `setEditingPostId`, `onUpdatePost`

**New Handler:**

```jsx
const handleCardClick = (e) => {
  // Don't trigger if clicking on interactive elements
  if (
    e.target.closest("button") ||
    e.target.closest(".river-avatar") ||
    e.target.closest(".river-author") ||
    e.target.closest(".river-post-actions") ||
    e.target.closest(".river-post-media") ||
    e.target.closest(".inline-comment-composer") ||
    e.target.closest(".thread-view")
  ) {
    return;
  }
  onCardClick?.(post);
};
```

**Card Click Enabled:**

```jsx
<div
  className={`river-post-card post--${type}...`}
  onClick={handleCardClick}
  style={{ cursor: 'pointer' }}
>
```

**ThreadView Props:** Added `postType={type}` for author coloring

**Full-Page Composer Simplification:**

- Removed `isEditMode` conditional - composer is always for replies now
- Removed edit-specific submit logic
- Moved post actions to new `.full-page-actions` container at bottom
- Simplified textarea and buttons (no edit mode branching)

---

#### 4. `frontend/src/components/pages/Home/components/TimelineRiverRow/components/ThreadView/ThreadView.jsx`

**Imports Added:**

```jsx
import { createPortal } from "react-dom";
import { MaximizeIcon } from "@assets/icons";
```

**Props Added:** `postType = 'thoughts'`

**State Added:**

```jsx
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingReply, setEditingReply] = useState(null);
```

**Author Color Class:**

```jsx
const authorColorClass = `reply-author--${postType}`;
// Used in: <span className={`reply-author ${authorColorClass}`}>
```

**Edit Form Changes:**

- Added `reply-edit-input-wrapper` container
- Added expand button inside input wrapper
- Icon-only cancel/save buttons:
  ```jsx
  <CloseIcon size={16} />  // Cancel
  <CheckIcon size={20} strokeWidth="2.5" />  // Save
  ```

**Expanded Edit Modal:** Added via createPortal when `isEditModalOpen && editingReply`

---

### Home Page Styles

#### 5. `frontend/src/components/pages/Home/components/TimelineRiverRow/styles/_composer.scss`

**Expand Button Styles:**

```scss
.comment-input-wrapper .expand-composer-btn {
  opacity: 0.8; // Changed from 0.6
  &:hover {
    box-shadow: 0 0 8px rgba(26, 115, 231, 0.3); // Added
  }
}
```

**Full-Page Composer Fixed Area:**

```scss
.full-page-composer-fixed {
  padding: var(--space-md) var(--space-xl); // Changed from var(--space-lg)
  flex-direction: column; // Added
  width: 100%;
  box-sizing: border-box;
}
```

**NEW: Post Actions Row:**

```scss
.full-page-actions {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--border-subtle);

  .reply-action-btn {
    /* Type-based hover colors */
    &:nth-child(1):hover {
      color: var(--heart-color);
    } // Like
    &:nth-child(2):hover {
      color: #c9a8ff;
    } // Comment
    &:nth-child(3):hover {
      color: #1ae784;
    } // Share
    &:nth-child(4):hover {
      color: #ffb347;
    } // Bookmark

    &.is-liked {
      color: var(--heart-color);
    }
  }
}
```

**NEW: Expanded Composer Modal:**

```scss
.expanded-composer-overlay {
  position: fixed;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.expanded-composer-modal {
  max-width: 700px;
  /* Holographic cosmic black background */
  border-radius: 24px;

  &.edit-mode {
    border-color: rgba(255, 193, 7, 0.4); // Gold for edit
    box-shadow: 0 0 60px rgba(255, 193, 7, 0.15);
  }
}

.expanded-composer-header {
  h3 {
    color: var(--cyan);
  }
  .edit-mode & h3 {
    color: #ffc107;
  } // Gold for edit
}

.expanded-composer-body .composer-textarea {
  min-height: 150px;
  /* Same holographic styling as main composer */

  .edit-mode & {
    border-color: rgba(255, 193, 7, 0.3);
  }
}

.expanded-composer-footer .submit-btn {
  background: linear-gradient(135deg, var(--cyan), var(--magenta));

  .edit-mode & {
    background: linear-gradient(135deg, #ffc107, #ff8800); // Gold
  }
}
```

---

#### 6. `frontend/src/components/pages/Home/components/TimelineRiverRow/styles/_thread.scss`

**Author Color Classes:**

```scss
.reply-author {
  &--thoughts {
    color: #1ce0e0;
  } // cyan/blue
  &--media {
    color: #ad7afe;
  } // purple
  &--milestones {
    color: #30c87ff9;
  } // green
}
```

**Edit Form Wrapper:**

```scss
.reply-edit-form {
  width: 100%;
  min-width: 350px;
}

.reply-edit-input-wrapper {
  flex: 1;
  position: relative;
  min-width: 300px;
}

.reply-edit-input {
  width: 100%;
  padding: 10px 36px 10px 12px; // Right padding for expand button
  box-sizing: border-box;
}
```

**Expand Button:**

```scss
.expand-edit-btn {
  position: absolute;
  bottom: 12px;
  right: 4px;
  width: 22px;
  height: 22px;
  opacity: 0.8;

  &:hover {
    color: var(--blue-primary);
    transform: scale(1.1);
    box-shadow: 0 0 8px rgba(26, 115, 231, 0.3);
  }
}
```

---

### Profile Page Components

#### 7. `frontend/src/components/pages/Profile/components/TimelineRiver/TimelineRiver.jsx`

**New Handler:**

```jsx
const handleCardClick = async (post) => {
  setActiveCommentPostId(post.id);
  setIsComposerFullPage(true);
  setIsEditMode(false);
  // Fetch replies if not already loaded
  if (!threadReplies[post.id]) {
    setLoadingThread(post.id);
    const result = await fetchReplies(post.id);
    if (result.success) {
      setThreadReplies((prev) => ({ ...prev, [post.id]: result.data }));
    }
    setLoadingThread(null);
  }
};
```

**RiverThread Props:** Added `postType={post.type}`

**View Component Props:** Added `onCardClick={handleCardClick}` to both:

- `RiverTimelineView`
- `RiverFeedView`

---

#### 8. `frontend/src/components/pages/Profile/components/TimelineRiver/components/RiverTimelineView/RiverTimelineView.jsx`

**Props Added:** `onCardClick`

**New Handler:**

```jsx
const handleCardClick = (e, post) => {
  if (
    e.target.closest("button") ||
    e.target.closest(".river-post-actions") ||
    e.target.closest(".river-card-media") ||
    e.target.closest(".inline-comment-composer") ||
    e.target.closest(".thread-view")
  ) {
    return;
  }
  onCardClick?.(post);
};
```

**Cards Made Clickable:**
All three card types (text-card, media-card, achievement-card):

```jsx
<div
  className="river-card text-card"
  onClick={(e) => handleCardClick(e, currentPost)}
  style={{ cursor: 'pointer' }}
>
```

---

#### 9. `frontend/src/components/pages/Profile/components/TimelineRiver/components/RiverFeedView/RiverFeedView.jsx`

**Props Added:** `onCardClick`

**New Handler:** Same as RiverTimelineView (excludes media, author clicks)

**Cards Made Clickable:** All three card types with click handlers

---

#### 10. `frontend/src/components/pages/Profile/components/TimelineRiver/components/RiverThread/RiverThread.jsx`

**Imports Added:**

```jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { CheckIcon, CloseIcon, MaximizeIcon } from "@assets/icons";
```

**Props Added:** `postType = 'thoughts'`

**State Added:**

```jsx
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingReply, setEditingReply] = useState(null);
const [isSaving, setIsSaving] = useState(false);
```

**Author Color Class:**

```jsx
const authorColorClass = `reply-author--${postType}`;
```

**New Handlers:**

- `handleExpandEdit(reply)` - Opens modal
- `handleCloseModal()` - Closes modal
- `handleModalSave()` - Saves from modal

**Edit Form Changes:**

- Added `reply-edit-input-wrapper` with expand button
- Icon-only buttons (CloseIcon, CheckIcon)
- Keyboard shortcuts (Escape, Enter)

**Expanded Edit Modal:** Added via createPortal

---

### Profile Page Styles

#### 11. `frontend/src/components/pages/Profile/components/TimelineRiver/TimelineRiver.scss`

**Imports Added:**

```scss
@import "../../../Home/components/TimelineRiverRow/styles/_thread";
@import "../../../Home/components/TimelineRiverRow/styles/_composer";
```

This imports all the thread and composer styles from Home, including:

- `.thread-view` container
- `.reply-author--thoughts/media/milestones` colors
- `.reply-edit-form` and expand button
- `.expanded-composer-overlay` and modal styles
- `.full-page-composer-fixed` and actions

---

## Summary of UX Changes

### Card Clicking

| Location               | Before        | After                                |
| ---------------------- | ------------- | ------------------------------------ |
| Home PostCard          | Not clickable | Clickable → opens full-page composer |
| Profile Timeline Cards | Not clickable | Clickable → opens full-page composer |
| Profile Feed Cards     | Not clickable | Clickable → opens full-page composer |

### Edit Modal

| Location            | Before                             | After                          |
| ------------------- | ---------------------------------- | ------------------------------ |
| Home                | Edit used same composer as replies | Dedicated edit modal           |
| Home ThreadView     | Text buttons                       | Icon buttons + expand to modal |
| Profile RiverThread | Text buttons                       | Icon buttons + expand to modal |

### Author Colors

Comment/reply author names are now colored by the parent post type:

- **Thoughts**: Cyan (#1ce0e0)
- **Media**: Purple (#ad7afe)
- **Milestones**: Green (#30c87f)

### Action Icons at Bottom

The full-page expanded view now has action icons (like, comment, share, bookmark) in a dedicated row at the bottom, above the reply composer.

---

## CSS Variables Used

```scss
--cyan: #4fffff;
--magenta: #dc08bc;
--heart-color: (dynamic, set per post type)
  --border-subtle: rgba(255, 255, 255, 0.1);
--bg-card-solid: #0a0a0a;
--text-muted: rgba(255, 255, 255, 0.5);
```

---

## Import Paths

```jsx
// Icons
import {
  EditIcon,
  CheckIcon,
  CloseIcon,
  MaximizeIcon,
  TrashIcon,
} from "@assets/icons";

// Portal
import { createPortal } from "react-dom";
```
