// =============================================================================
// 🔵 PABLO - UI Architect
// SideNav.jsx - Side navigation component (desktop left / mobile bottom)
// =============================================================================
//
// TODO: Build responsive navigation that switches between left rail and bottom bar
//
// IMPORTS:
// - useNavigate, useLocation from react-router-dom
// - useState, useEffect from react
// - useMessages, useSearch from @contexts
// - SideNav.scss (PROVIDED - don't modify)
// - Icons: HexHomeIcon, TargetReticleIcon, MessageBubbleIcon, SignalIcon,
//          NetworkIcon, HexProfileIcon, CircuitInfoIcon
//
// RESPONSIVE BEHAVIOR:
// - Desktop (>480px): Vertical left rail (.left-nav)
// - Mobile (≤480px): Horizontal bottom bar (.bottom-nav)
// - Use window.innerWidth and resize listener
//
// NAV ITEMS:
// 1. Home → /home (always visible)
// 2. Search → opens search modal (always visible)
// 3. Messages → opens message modal (always visible)
// 4. Notifications → /notifications (always visible)
// 5. Friends → /friends (hidden when on /friends)
// 6. Profile → /profile (hidden when on /profile)
// 7. About → /about (hidden when on /about)
//
// HOOKS NEEDED:
// - useNavigate() for navigation
// - useLocation() → location.pathname for active state
// - useState for isDesktop
// - useEffect for resize listener
// - useMessages() → { isMessageModalOpen, openMessages }
// - useSearch() → { openSearch, isSearchModalOpen }
//
// MODAL INTERACTION:
// - When message modal is open:
//   - Add 'nav-disabled' class to nav
//   - Disable all nav items except Messages
//   - Prevent navigation clicks
//
// ACTIVE STATE:
// - Compare location.pathname to route
// - Or check if modal is open (search, messages)
//
// EACH NAV BUTTON:
// <button className={`nav-item ${isActive ? 'active' : ''}`}
//         onClick={...}
//         title="..."
//         disabled={isMessageModalOpen}>
//   <div className="nav-icon"><IconComponent size={24} /></div>
//   <span>Label</span>
// </button>
// =============================================================================

import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useMessages, useSearch } from '@contexts';
import './SideNav.scss';
import {
  HexHomeIcon,
  TargetReticleIcon,
  MessageBubbleIcon,
  SignalIcon,
  NetworkIcon,
  HexProfileIcon,
  CircuitInfoIcon
} from '@assets/icons';

function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 480);
  const { isMessageModalOpen, openMessages } = useMessages();
  const { openSearch, isSearchModalOpen } = useSearch();

  useEffect(() => {
    const handleResize = () => {
      // TODO: Update isDesktop based on window.innerWidth
    };
    
    // TODO: Add resize listener
    // TODO: Return cleanup function
  }, []);

  const handleNavClick = (path) => {
    // TODO: If isMessageModalOpen, return early (don't navigate)
    // TODO: Otherwise, navigate(path)
  };

  return (
    <nav className={`main-nav ${isDesktop ? 'left-nav' : 'bottom-nav'} ${isMessageModalOpen ? 'nav-disabled' : ''}`}>
      <button 
        className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}
        onClick={() => handleNavClick('/home')}
        title="Home"
        disabled={isMessageModalOpen}
      >
        <div className="nav-icon">
          <HexHomeIcon size={24} />
        </div>
        <span>Home</span>
      </button>
      
      <button 
        className={`nav-item ${isSearchModalOpen ? 'active' : ''}`}
        onClick={openSearch}
        title="Search"
        disabled={isMessageModalOpen}
      >
        <div className="nav-icon">
          <TargetReticleIcon size={24} />
        </div>
        <span>Search</span>
      </button>
      
      <button 
        className={`nav-item ${isMessageModalOpen ? 'active' : ''}`}
        onClick={openMessages}
        title="Messages"
      >
        <div className="nav-icon">
          <MessageBubbleIcon size={24} />
        </div>
        <span>Messages</span>
      </button>
      
      <button 
        className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}
        onClick={() => handleNavClick('/notifications')}
        title="Notifications"
        disabled={isMessageModalOpen}
      >
        <div className="nav-icon">
          <SignalIcon size={24} />
        </div>
        <span>Notifications</span>
      </button>
      
      {/* TODO: Conditionally show Friends, Profile, About buttons */}
      {/* Hide button if already on that route */}
      {location.pathname !== '/friends' && (
        <button 
          className={`nav-item ${location.pathname === '/friends' ? 'active' : ''}`}
          onClick={() => handleNavClick('/friends')}
          title="Friends"
          disabled={isMessageModalOpen}
        >
          <div className="nav-icon">
            <NetworkIcon size={24} />
          </div>
          <span>Friends</span>
        </button>
      )}
      
      {location.pathname !== '/profile' && (
        <button 
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          onClick={() => handleNavClick('/profile')}
          title="Profile"
          disabled={isMessageModalOpen}
        >
          <div className="nav-icon">
            <HexProfileIcon size={24} />
          </div>
          <span>Profile</span>
        </button>
      )}
      
      {location.pathname !== '/about' && (
        <button 
          className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}
          onClick={() => handleNavClick('/about')}
          disabled={isMessageModalOpen}
        >
          <div className="nav-icon">
            <CircuitInfoIcon size={24} />
          </div>
          <span>About</span>
        </button>
      )}
    </nav>
  );
}

export default SideNav;
