# Mobile SideNav Slide Feature - IMPLEMENT LAST

> **Status:** Deferred - Implement after core rebuild is complete  
> **Priority:** Low (Enhancement)  
> **Added:** Jan 2026 (last addition to reference project)

---

## Overview

This feature adds a hamburger menu for mobile/tablet (≤768px) that slides the SideNav in/out, replacing the always-visible bottom nav behavior.

**Current behavior:** SideNav switches between left-rail (desktop) and bottom-bar (mobile)  
**New behavior:** SideNav is always left-rail style, but slides in/out on mobile via hamburger button

---

## Files to Create/Modify

### 1. NEW: `SideNavContext.jsx`

Create `frontend/src/contexts/SideNavContext.jsx`:

```jsx
// State: isOpen, isMobile (≤768px breakpoint)
// Actions: openNav, closeNav, toggleNav
// Auto-closes on route change (mobile)
// Auto-closes when resizing to desktop
```

### 2. UPDATE: `contexts/index.js`

Add export:

```jsx
export { SideNavProvider, useSideNav } from "./SideNavContext";
```

### 3. UPDATE: `App.jsx`

Wrap `AppContent` with `SideNavProvider` (inside BrowserRouter, since context uses useLocation)

### 4. NEW ICON: `HamburgerIcon` in `navigation.jsx`

```jsx
export const HamburgerIcon = ({ size = 24, className = '', ...props }) => (
  <svg ...>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
```

Export in `icons/index.js`

### 5. UPDATE: `TopBar.jsx`

- Import `useSideNav`, `HamburgerIcon`, `CloseIcon`
- Add hamburger button (mobile only):

```jsx
{
  isMobile && (
    <button className="hamburger-btn" onClick={toggleNav}>
      {isSideNavOpen ? <CloseIcon /> : <HamburgerIcon />}
    </button>
  );
}
```

### 6. UPDATE: `TopBar.scss`

Add styles:

```scss
.hamburger-btn {
  display: none;
  // minimal styling - no background, no border
}

@media (max-width: 768px) {
  .hamburger-btn {
    display: flex;
  }
  .top-bar {
    justify-content: flex-start;
  }
  .top-bar-logo {
    flex: 1;
    margin-left: 0;
  }
}
```

Also fix: `.top-bar-logo` - remove `top: -5px`, add `align-self: center`

### 7. UPDATE: `SideNav.jsx`

- Replace `useState/useEffect` with `useSideNav` context
- Use `isOpen`, `isMobile`, `closeNav` from context
- Add `mobile-slide` class for mobile behavior
- Add backdrop overlay:

```jsx
{
  isMobile && isOpen && <div className="nav-backdrop" onClick={closeNav} />;
}
```

- Remove all `<span>` text labels (icons only)

### 8. UPDATE: `SideNav.scss`

Add mobile-slide behavior:

```scss
.nav-backdrop {
  /* overlay styles */
}

@media (max-width: 768px) {
  .main-nav.left-nav.mobile-slide {
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    &.is-open {
      transform: translateX(0);
    }
  }
}
```

### 9. UPDATE: `SearchModal.scss`

Add mobile padding adjustment:

```scss
@media (max-width: 768px) {
  .search-modal-overlay {
    padding-left: 70px;
    padding-right: 15px;
  }
}
```

---

## Reference Files

**All reference code is located in `docs/refactoring/` folder:**

| File                      | Contains                                      |
| ------------------------- | --------------------------------------------- |
| `ref-SideNavContext.md`   | Full SideNavContext.jsx code                  |
| `ref-TopBar-jsx.md`       | Full TopBar.jsx with hamburger button         |
| `ref-TopBar-scss.md`      | Full TopBar.scss with mobile styles           |
| `ref-SideNav-jsx.md`      | Full SideNav.jsx with backdrop + mobile-slide |
| `ref-SideNav-scss.md`     | Full SideNav.scss with slide behavior         |
| `ref-SearchModal-scss.md` | Full SearchModal.scss with mobile padding     |
| `ref-navigation-icons.md` | HamburgerIcon export                          |

Copy code directly from these files when implementing.

---

## Implementation Order

1. Create `SideNavContext.jsx` + export
2. Add `HamburgerIcon` + export
3. Update `App.jsx` with provider
4. Update `TopBar.jsx` + `TopBar.scss`
5. Update `SideNav.jsx` + `SideNav.scss`
6. Update `SearchModal.scss`
7. Test on mobile/tablet viewports

---

## Notes

- This was the last feature added to the reference project
- Can be done as a separate PR after core rebuild
- Breakpoint is 768px (tablet and below)
- 480px has additional adjustments for smaller mobile
