# navigation.jsx (icons) Reference

Add this HamburgerIcon to `frontend/src/assets/icons/navigation.jsx`:

```jsx
/** Hamburger menu - 3 lines */
export const HamburgerIcon = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
    {...props}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
```

Then export it in `frontend/src/assets/icons/index.js`:

```jsx
// Navigation
export {
  TargetReticleIcon,
  BroadcastIcon,
  LogoutIcon,
  LoginIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BackIcon,
  FlipIcon,
  HamburgerIcon, // ADD THIS
} from "./navigation";
```

Note: `CloseIcon` already exists in `actions.jsx` and is already exported.
