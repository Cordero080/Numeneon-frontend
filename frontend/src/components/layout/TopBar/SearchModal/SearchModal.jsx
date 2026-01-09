// =============================================================================
// 🔵 PABLO - UI Architect
// SearchModal.jsx - Global search modal for users and posts
// =============================================================================
//
// ┌────────────────────────────────────────────────────────────────────────────┐
// │ [🎯] Search users or posts..._________________________ [×] [✕]            │
// ├────────────────────────────────────────────────────────────────────────────┤
// │  [All]  [Users (3)]  [Posts (5)]                                          │
// ├────────────────────────────────────────────────────────────────────────────┤
// │  USERS                                                                     │
// │  ┌──────────────────────────────────────────────────────────────────────┐ │
// │  │ [AB] Arthur Bernier  @arthurb                              [💬]     │ │
// │  │ [NP] Natalia P       @nataliap                             [💬]     │ │
// │  └──────────────────────────────────────────────────────────────────────┘ │
// │  POSTS                                                                     │
// │  ┌──────────────────────────────────────────────────────────────────────┐ │
// │  │ [AB] @arthurb                                                        │ │
// │  │      Just built something cool with React...                         │ │
// │  └──────────────────────────────────────────────────────────────────────┘ │
// └────────────────────────────────────────────────────────────────────────────┘
//
// =============================================================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts, useFriends, useMessages } from '@contexts';
import { TargetReticleIcon, CloseIcon, MessageBubbleIcon } from '@assets/icons';
import './SearchModal.scss';

// HELPER: Get initials from name (e.g., "Arthur Bernier" → "AB")
const getInitials = (name) => {
  // TODO: Return first 2 letters as initials
  // Handle: null, single word names, full names
};

function SearchModal({ isOpen, onClose }) {
  // ─────────────────────────────────────────────────────────────────────────
  // STATE & REFS
  // ─────────────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'users' | 'posts'
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────────────────
  const { posts } = usePosts();
  const { friends } = useFriends();
  const { openMessages } = useMessages();

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────
  
  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  
  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // TODO: If Escape, clear search and close modal
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  const handleClose = () => {
    setSearchQuery('');
    setActiveTab('all');
    onClose();
  };

  const handleUserClick = (user) => {
    // TODO: Navigate to /profile/:username
    // TODO: Call handleClose()
  };

  const handleMessageUser = (e, user) => {
    // TODO: e.stopPropagation() to prevent triggering handleUserClick
    // TODO: Call openMessages with user data
    // TODO: Call handleClose()
  };

  const handlePostClick = (post) => {
    // TODO: Navigate to post author's profile
    // TODO: Call handleClose()
  };

  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────────────────
  
  // Build searchable users list from posts authors + friends
  const postAuthors = posts.reduce((acc, post) => {
    // TODO: Extract unique authors from posts
    // Each author: { id, username, displayName, first_name, last_name }
    return acc;
  }, []);

  const allUsers = [...friends, ...postAuthors].reduce((acc, user) => {
    // TODO: Deduplicate by username
    return acc;
  }, []);

  // Filter based on search query
  const query = searchQuery.toLowerCase().trim();
  
  const filteredUsers = query ? allUsers.filter(user => {
    // TODO: Match against username, first_name, last_name, displayName
    return false;
  }) : [];

  const filteredPosts = query ? posts.filter(post => {
    // TODO: Match against content, author username
    return false;
  }).slice(0, 10) : []; // Limit to 10 posts

  const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0;
  const showUsers = activeTab === 'all' || activeTab === 'users';
  const showPosts = activeTab === 'all' || activeTab === 'posts';

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={handleClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SEARCH HEADER                                                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="search-header">
          <div className="search-input-wrapper">
            <TargetReticleIcon size={20} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search users or posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <button className="close-btn-glow" onClick={handleClose}>
            <CloseIcon size={20} />
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* FILTER TABS (only shown when there are results)                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {query && hasResults && (
          <div className="search-tabs">
            <button 
              className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`search-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users ({filteredUsers.length})
            </button>
            <button 
              className={`search-tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts ({filteredPosts.length})
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SEARCH RESULTS                                                      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="search-results">
          
          {/* Empty State: No query */}
          {!query && (
            <div className="search-empty">
              <p>Start typing to search...</p>
              <p className="search-hint">Search for users by name or username, or find posts by content</p>
            </div>
          )}

          {/* Empty State: No results */}
          {query && !hasResults && (
            <div className="search-empty">
              <p>No results for "{searchQuery}"</p>
              <p className="search-hint">Try a different search term</p>
            </div>
          )}

          {/* Users Results Section */}
          {query && showUsers && filteredUsers.length > 0 && (
            <div className="search-section">
              <h3 className="search-section-title">Users</h3>
              {filteredUsers.map(user => (
                <div 
                  key={user.username} 
                  className="search-result-item user-result"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="result-avatar">
                    <span>{/* TODO: getInitials(user.displayName || user.username) */}</span>
                  </div>
                  <div className="result-info">
                    <span className="result-name">
                      {/* TODO: Display name or username */}
                    </span>
                    <span className="result-username">@{user.username}</span>
                  </div>
                  <button 
                    className="result-action"
                    onClick={(e) => handleMessageUser(e, user)}
                    title="Send message"
                  >
                    <MessageBubbleIcon size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Posts Results Section */}
          {query && showPosts && filteredPosts.length > 0 && (
            <div className="search-section">
              <h3 className="search-section-title">Posts</h3>
              {filteredPosts.map(post => (
                <div 
                  key={post.id} 
                  className="search-result-item post-result"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="result-avatar small">
                    <span>{/* TODO: getInitials(post.author?.username) */}</span>
                  </div>
                  <div className="result-info">
                    <span className="result-username">@{post.author?.username}</span>
                    <span className="result-content">
                      {/* TODO: Truncate content to 80 chars */}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
