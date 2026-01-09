// =============================================================================
// 🔵 PABLO - UI Architect
// TopBar.jsx - Top navigation bar component
// =============================================================================
//
// TODO: Build the top navigation bar with icons and modals
//
// IMPORTS:
// - useState from react
// - useNavigate from react-router-dom
// - TopBar.scss (PROVIDED - don't modify)
// - Child components: MessageModal, SearchModal, NotificationModal
// - ThemeToggle from @components/ui/ThemeToggle
// - Contexts: useMessages, useAuth, useFriends, useSearch
// - Icons: TargetReticleIcon, MessageBubbleIcon, BroadcastIcon, LogoutIcon, LoginIcon
//
// STRUCTURE:
// ┌────────────────────────────────────────────────────────────────────────┐
// │ [NUMENEON logo]                    🌓 🔍 💬 🔔 🚪                      │
// │                                   Theme Search Msgs Notif Logout       │
// └────────────────────────────────────────────────────────────────────────┘
//
// HOOKS NEEDED:
// - useMessages() → { isMessageModalOpen, openMessages, closeMessages }
// - useAuth() → { logout, user }
// - useFriends() → { pendingRequests } (for notification badge count)
// - useSearch() → { isSearchModalOpen, openSearch, closeSearch }
// - useNavigate() for routing
//
// LOCAL STATE:
// - isNotificationsOpen: Boolean for notification modal
//
// RENDER LOGIC:
// 1. Logo: Clickable, navigates to '/'
// 2. Icon bar (right side):
//    - ThemeToggle component
//    - Search icon → opens search modal
//    - Messages icon → opens message modal  
//    - If user logged in:
//      - Notification icon → opens notification modal
//        - Show badge with pendingRequests.length if > 0
//      - Logout icon → calls logout() and navigates to /login
//    - If user NOT logged in:
//      - Login icon → navigates to /login
//
// 3. Modals (conditional rendering below TopBar):
//    - MessageModal when isMessageModalOpen
//    - SearchModal with isOpen/onClose props
//    - NotificationModal with isOpen/onClose props
//
// SCSS class names (already in TopBar.scss):
// - .top-bar
// - .top-bar-logo
// - .top-bar-icons
// - .icon-placeholder, .icon-search, .icon-messages, etc.
// - .notification-badge
// =============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.scss';
import MessageModal from './MessageModal/MessageModal';
import SearchModal from './SearchModal/SearchModal';
import NotificationModal from './NotificationModal/NotificationModal';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useMessages, useAuth, useFriends, useSearch } from '@contexts';
import { 
  TargetReticleIcon, 
  MessageBubbleIcon, 
  BroadcastIcon, 
  LogoutIcon, 
  LoginIcon 
} from '@assets/icons';

function TopBar() {
  const { isMessageModalOpen, openMessages, closeMessages } = useMessages();
  const { logout, user } = useAuth();
  const { pendingRequests } = useFriends();
  const { isSearchModalOpen, openSearch, closeSearch } = useSearch();
  const navigate = useNavigate();
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Call logout()
    // TODO: Navigate to '/login'
  };

  return (
    <>
      <div className="top-bar">
        <div 
          className="top-bar-logo" 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
          title="Go to Landing"
        >
          NUMENEON
        </div>
        <div className="top-bar-icons">
          <ThemeToggle />
          <div 
            className="icon-placeholder icon-search" 
            title="Search"
            onClick={openSearch}
            style={{ cursor: 'pointer' }}
          >
            <TargetReticleIcon size={20} />
          </div>
          <div 
            className="icon-placeholder icon-messages" 
            title="Messages"
            onClick={openMessages}
          >
            <MessageBubbleIcon size={20} />
          </div>
          {user && (
            <>
              <div 
                className="icon-placeholder icon-notifications" 
                title="Notifications"
                onClick={() => setIsNotificationsOpen(true)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <BroadcastIcon size={20} />
                {/* TODO: Show badge if pendingRequests.length > 0 */}
                {pendingRequests.length > 0 && (
                  <span className="notification-badge">{/* TODO: count */}</span>
                )}
              </div>
              <div 
                className="icon-placeholder icon-logout" 
                title="Logout"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                <LogoutIcon size={20} />
              </div>
            </>
          )}
          {!user && (
            <div 
              className="icon-placeholder icon-login" 
              title="Login"
              onClick={() => navigate('/login')}
              style={{ cursor: 'pointer' }}
            >
              <LoginIcon size={20} />
            </div>
          )}
        </div>
      </div>

      {isMessageModalOpen && (
        <MessageModal onClose={closeMessages} />
      )}
      
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={closeSearch} 
      />
      
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}

export default TopBar;