// 🔵 PABLO - UI Architect
// TopBar.jsx - Top navigation bar component

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.scss';
import MessageModal from './MessageModal/MessageModal';
import SearchModal from './SearchModal/SearchModal';
import NotificationModal from './NotificationModal/NotificationModal';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useMessages, useAuth, useFriends, useSearch, useSideNav } from '@contexts';
import { 
  TargetReticleIcon, 
  MessageBubbleIcon, 
  BroadcastIcon, 
  LogoutIcon, 
  LoginIcon,
  HamburgerIcon,
  CloseIcon 
} from '@assets/icons';

function TopBar() {
  const { isMessageModalOpen, openMessages, closeMessages } = useMessages();
  const { logout, user } = useAuth();
  const { pendingRequests } = useFriends();
  const { isSearchModalOpen, openSearch, closeSearch } = useSearch();
  const { isOpen: isSideNavOpen, toggleNav, isMobile } = useSideNav();
  const navigate = useNavigate();
  
  // 🔵 Local state for notification modal
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="top-bar">
        {/* 🔵 Hamburger menu button - mobile only */}
        {isMobile && (
          <button 
            className="hamburger-btn"
            onClick={toggleNav}
            aria-label={isSideNavOpen ? 'Close menu' : 'Open menu'}
          >
            {isSideNavOpen ? <CloseIcon size={24} /> : <HamburgerIcon size={24} />}
          </button>
        )}
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
                {/* Notification badge */}
                {pendingRequests.length > 0 && (
                  <span className="notification-badge">{pendingRequests.length}</span>
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
          {/* Always show login link if not logged in */}
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

      {/* Message Modal */}
      {isMessageModalOpen && (
        <MessageModal onClose={closeMessages} />
      )}
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={closeSearch} 
      />
      
      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}

export default TopBar;