/**
 * Sidenav Icons
 * Specialized navigation icons for sidebar
 */

/** Hexagon home with center node */
export const HexHomeIcon = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    {...props}
  >
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
  </svg>
);

/** Signal broadcast/pulse for notifications */
export const SignalIcon = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    {...props}
  >
    <circle cx="12" cy="18" r="3"/>
    <path d="M7 13a7 7 0 0 1 10 0"/>
    <path d="M4 9a12 12 0 0 1 16 0"/>
  </svg>
);

/** Connected nodes network for friends */
export const NetworkIcon = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    {...props}
  >
    <circle cx="6" cy="6" r="3"/>
    <circle cx="18" cy="6" r="3"/>
    <circle cx="12" cy="18" r="3"/>
    <line x1="8.5" y1="7.5" x2="10" y2="15.5"/>
    <line x1="15.5" y1="7.5" x2="14" y2="15.5"/>
    <line x1="9" y1="6" x2="15" y2="6"/>
  </svg>
);

/** Circuit chip for about/info */
export const CircuitInfoIcon = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    {...props}
  >
    <rect x="5" y="5" width="14" height="14" rx="2"/>
    <line x1="5" y1="9" x2="2" y2="9"/>
    <line x1="5" y1="15" x2="2" y2="15"/>
    <line x1="19" y1="9" x2="22" y2="9"/>
    <line x1="19" y1="15" x2="22" y2="15"/>
    <line x1="12" y1="10" x2="12" y2="15"/>
    <circle cx="12" cy="8" r="0.5" fill="currentColor"/>
  </svg>
);
