# Collapsible Cards Feature - Study Guide

## What Is This Feature?

The **Collapsible Cards** (aka "Pill Collapse") feature lets users minimize post categories they don't want to see. Instead of showing the full card deck, a collapsed category becomes a small pill/tab that can be clicked to expand again.

**Before:** All 3 categories (Thoughts, Media, Milestones) always show full cards
**After:** Users can collapse any category to a small tab, decluttering their feed

---

## Visual Example

```
EXPANDED (default):
┌─────────────────────────────────────────────────────────┐
│  [💭 Thoughts 5]   [🖼 Media 3]   [⭐ Milestones 2]     │  ← Tabs row
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│  │  Card   │    │  Card   │    │  Card   │             │  ← Content row
│  │ Content │    │ Content │    │ Content │             │
│  └─────────┘    └─────────┘    └─────────┘             │
└─────────────────────────────────────────────────────────┘

AFTER COLLAPSING "Media":
┌─────────────────────────────────────────────────────────┐
│  [💭 Thoughts 5]   [🖼 3]   [⭐ Milestones 2]           │  ← Media tab greyed out
├─────────────────────────────────────────────────────────┤
│  ┌───────────────┐         ┌───────────────┐           │
│  │     Card      │         │     Card      │           │  ← Only 2 columns now
│  │    Content    │         │    Content    │           │
│  └───────────────┘         └───────────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### 1. State Management with `Set`

```jsx
const [collapsedDecks, setCollapsedDecks] = useState(new Set());
```

**What is a Set?**
- A JavaScript `Set` is like an array, but only stores **unique values**
- Perfect for tracking "which categories are collapsed" because a category can only be collapsed or not

**Why not use an array?**
- Arrays can have duplicates: `['thoughts', 'thoughts']` 
- Sets automatically prevent this: `new Set(['thoughts', 'thoughts'])` → `{'thoughts'}`

**Common Set operations:**
```jsx
// Check if something is in the Set
collapsedDecks.has('thoughts')  // true or false

// Add to Set (returns new Set)
new Set([...prev, 'media'])

// Remove from Set
const newSet = new Set(prev);
newSet.delete('media');
```

---

### 2. Collapse Handler

```jsx
const handleCollapseDeck = (type) => {
  setCollapsedDecks(prev => new Set([...prev, type]));
};
```

**Line by line:**
1. `(type)` - The category being collapsed ('thoughts', 'media', or 'milestones')
2. `prev =>` - Get the previous Set state
3. `[...prev, type]` - Spread existing items + add new type into array
4. `new Set(...)` - Convert back to Set (removes any duplicates)

**Example flow:**
```
User clicks "collapse" on Media
→ handleCollapseDeck('media') called
→ prev = Set {} (empty, nothing collapsed)
→ [...prev, 'media'] = ['media']
→ new Set(['media']) = Set {'media'}
→ collapsedDecks is now Set {'media'}
```

---

### 3. Expand Handler

```jsx
const handleExpandDeck = (type) => {
  setCollapsedDecks(prev => {
    const next = new Set(prev);  // Copy the Set
    next.delete(type);            // Remove the type
    return next;                  // Return new Set
  });
};
```

**Why copy first?**
- React state should be **immutable** (never modify directly)
- `new Set(prev)` creates a copy we can safely modify
- Then `delete()` removes the type from the copy

---

### 4. Conditional Rendering

```jsx
{!collapsedDecks.has('thoughts') && (
  <SmartDeckContent 
    posts={thoughts}
    type="thoughts"
    // ... other props
  />
)}
```

**What this means:**
- `collapsedDecks.has('thoughts')` - Is 'thoughts' in the collapsed set?
- `!` - Negate it (NOT collapsed)
- `&&` - If true, render the component

**Truth table:**
| `has('thoughts')` | `!has('thoughts')` | Renders? |
|-------------------|--------------------| ---------|
| `true` (collapsed) | `false` | ❌ No |
| `false` (expanded) | `true` | ✅ Yes |

---

### 5. Dynamic CSS Classes

```jsx
className={`deck-tab deck-tab--${type}${isCollapsed ? ' deck-tab--collapsed' : ''}`}
```

**Template literal breakdown:**
1. `` `...` `` - Template literal (allows `${expressions}`)
2. `deck-tab` - Always applied (base class)
3. `deck-tab--${type}` - Type-specific class (e.g., `deck-tab--thoughts`)
4. `${isCollapsed ? ' deck-tab--collapsed' : ''}` - Conditional class

**Example outputs:**
```
type='thoughts', isCollapsed=false → "deck-tab deck-tab--thoughts"
type='media', isCollapsed=true    → "deck-tab deck-tab--media deck-tab--collapsed"
```

---

## Component Architecture

### Before (Single Component)
```
SmartDeck
├── Header (icon, label, count)
├── Card Content
└── Navigation (dots, arrows)
```

### After (Split Components)
```
SmartDeckHeader    ← Standalone, used in tabs row
SmartDeckContent   ← Standalone, used in content row
SmartDeck          ← Combined (legacy, backwards compatible)
```

**Why split?**
- Headers always visible (even when collapsed) → fixed tabs row
- Content only shows when expanded → flexible content row
- Allows different layouts without duplicating code

---

## File Structure

```
TimelineRiverRow/
├── TimelineRiverRow.jsx      ← Main component, manages collapsedDecks state
├── components/
│   └── SmartDeck/
│       ├── SmartDeck.jsx     ← SmartDeckHeader, SmartDeckContent exports
│       └── SmartDeck.scss
└── styles/
    ├── _base.scss            ← Tabs row, content row layout
    └── _smart-deck.scss      ← Collapsed states, header styles
```

---

## SCSS Patterns

### BEM Naming Convention

```scss
.smart-deck                    // Block
.smart-deck--thoughts          // Block--modifier (type variant)
.smart-deck--collapsed         // Block--modifier (state)
.smart-deck-header             // Block-element
.smart-deck-header--recent     // Block-element--modifier
```

**BEM = Block Element Modifier**
- **Block:** Standalone component (`.smart-deck`)
- **Element:** Part of block, uses `__` or `-` (`.smart-deck-header`)
- **Modifier:** Variant/state, uses `--` (`.smart-deck--collapsed`)

### Opacity for Collapsed State

```scss
.deck-tab--collapsed {
  opacity: 0.35;           // Greyed out
  &:hover { opacity: 0.6; } // Slightly brighter on hover
}
```

**Why opacity?**
- Keeps the element visible but clearly "inactive"
- Better than `display: none` because user can still see/click it
- Smooth transition possible with `transition: opacity 0.3s`

---

## Per-Friend Collapse (RiverFeedView)

The friends feed has a twist: each friend row has **independent** collapse state.

```jsx
// Map of "username-rowIndex" → Set of collapsed types
const [friendCollapsedDecks, setFriendCollapsedDecks] = useState(new Map());
```

**Why a Map?**
- Need to track collapse state **per friend row**
- Key: `"alice-row0"`, `"bob-row0"`, etc.
- Value: `Set` of collapsed types for that specific row

**Example state:**
```jsx
Map {
  "alice-row0" => Set { "media" },      // Alice's row has Media collapsed
  "bob-row0" => Set { "thoughts" },     // Bob's row has Thoughts collapsed
  "alice-row1" => Set {}                // Alice's 2nd row has nothing collapsed
}
```

---

## Quick Reference

| Concept | Syntax | Purpose |
|---------|--------|---------|
| Track collapsed | `useState(new Set())` | Store which types are collapsed |
| Check if collapsed | `collapsedDecks.has(type)` | Returns boolean |
| Collapse | `new Set([...prev, type])` | Add type to Set |
| Expand | `prev.delete(type)` | Remove type from Set |
| Conditional render | `{!collapsed && <Component />}` | Only show if expanded |
| Dynamic class | `` `base ${cond ? 'mod' : ''}` `` | Add class conditionally |

---

## Try It Yourself

1. Find `TimelineRiverRow.jsx` and locate the `collapsedDecks` state
2. Follow where `handleCollapseDeck` is passed as a prop
3. See how `SmartDeckHeader` receives `onCollapse` and calls it on click
4. Check the SCSS to see how `.deck-tab--collapsed` changes the appearance

---

## Related Files

- [collapsible-cards-files.md](../collapsible-cards-files.md) - Full implementation reference
- [TimelineRiverRow.jsx](../../frontend/src/components/pages/Home/components/TimelineRiverRow/TimelineRiverRow.jsx)
- [SmartDeck.jsx](../../frontend/src/components/pages/Home/components/TimelineRiverRow/components/SmartDeck/SmartDeck.jsx)
