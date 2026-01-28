# Shared Helpers Refactor (Jan 2026)

## Summary
Extracted duplicated helper functions into a single shared `utils/helpers.js` file, reducing code duplication across 4+ components.

---

## What Changed

### Created New File
- **`frontend/src/utils/helpers.js`** — Central location for all shared helper functions

### Updated Files (removed duplicates, added imports)
| File | Lines Removed | What Was Removed |
|------|---------------|------------------|
| `Profile.jsx` | ~30 lines | `getDisplayName`, `getInitials`, `formatRelativeTime` |
| `Friends.jsx` | ~20 lines | `getDisplayName`, `getInitials`, `getColorVariant` |
| `Home.jsx` | ~5 lines | `getInitials` |
| `groupPosts.js` | ~20 lines | `getDisplayName`, `getInitials`, `getPostTime` |

---

## The Shared Helpers

### 🧑 User Display Helpers

#### `getDisplayName(user)`
Gets a user's display name (full name or username fallback).

```javascript
getDisplayName({ first_name: "John", last_name: "Doe" }) // "John Doe"
getDisplayName({ username: "johndoe" })                  // "johndoe"
getDisplayName(null)                                      // "User"
```

#### `getInitials(user)`
Gets 1-2 character initials for avatar display.

```javascript
getInitials({ first_name: "John", last_name: "Doe" }) // "JD"
getInitials({ first_name: "Alice" })                  // "AL"
getInitials({ username: "bob123" })                   // "BO"
```

#### `getInitialsFromName(name)`
Gets initials from a simple name string (not a user object).

```javascript
getInitialsFromName("John Doe")  // "JD"
getInitialsFromName("Alice")     // "AL"
```

---

### ⏰ Time Formatting Helpers

#### `formatRelativeTime(dateString)`
Converts a timestamp to human-readable "time ago" format.

```javascript
formatRelativeTime("2026-01-28T10:00:00Z") // "5m ago" (if it's 10:05)
formatRelativeTime(new Date())              // "just now"
```

**How it works:**
1. Calculate difference between now and the given date
2. Convert to appropriate unit (seconds → minutes → hours → days → weeks)
3. Return human-readable string

**The "magic":** This doesn't track time — it just does math on each render!

#### `formatShortDate(dateString)`
Formats a date for headers (e.g., "Jan 4").

```javascript
formatShortDate("2026-01-28T10:00:00Z") // "Jan 28"
```

#### `getPostTime(post)`
Gets timestamp in milliseconds from a post object. Handles different API field names.

```javascript
getPostTime({ createdAt: "2026-01-28T10:00:00Z" })  // 1769508000000
getPostTime({ created_at: "2026-01-28T10:00:00Z" }) // 1769508000000
```

---

### 🎨 UI Helpers

#### `getColorVariant(userId, variantCount)`
Gets a consistent color variant for a user (for avatars, badges, etc.).

```javascript
getColorVariant(123)  // Always returns same number for user 123
getColorVariant(456)  // Different but consistent for user 456
```

---

## Why This Is Better

### 1. DRY Principle (Don't Repeat Yourself)
- **Before:** Same function copied into 4+ files (~75 lines of duplication)
- **After:** One function in one place, imported everywhere

### 2. Single Source of Truth
- Fix a bug once → fixed everywhere
- Change formatting once → updated everywhere
- No more "which version is correct?"

### 3. Easier Testing
- Test helpers once in isolation
- Don't need to test same logic in every component

### 4. Cleaner Components
- Components focus on their main job (rendering UI)
- Less noise, easier to read and understand

### 5. Industry Standard
- This is how professional codebases are organized
- Recognizing this pattern helps in interviews and jobs

---

## How to Use

```javascript
// Import what you need
import { getInitials, getDisplayName, formatRelativeTime } from '@utils/helpers';

// Use in your component
const avatar = getInitials(user);
const name = getDisplayName(user);
const timeAgo = formatRelativeTime(post.createdAt);
```

---

## Files Reference

| Helper | Where It's Used |
|--------|-----------------|
| `getDisplayName` | Profile, Friends, groupPosts |
| `getInitials` | Profile, Friends, Home, groupPosts |
| `formatRelativeTime` | Profile, TimelineRiver, MessageModal |
| `getPostTime` | groupPosts |
| `getColorVariant` | Friends |

---

_This refactor makes the codebase cleaner, more maintainable, and teaches you how real production apps are organized!_
