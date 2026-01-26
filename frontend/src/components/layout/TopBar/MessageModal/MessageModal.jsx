// 🔵 PABLO - UI Architect
// MessageModal.jsx - Full-screen messaging modal with blurred backdrop
//
// This component now:
// 1. Uses MessageContext for state (conversations, messages)
// 2. Clicking a conversation in the sidebar switches the active chat
// 3. Typing and clicking send actually adds messages
// 4. Shows real messages from context state

import { useState, useRef, useEffect } from 'react';
import { MinimizeIcon, MaximizeIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon, MessageBubbleIcon, PlusIcon } from '@assets/icons';
import { useMessages } from '@contexts/MessageContext';
import usersService from '@services/usersService';
import './MessageModal.scss';

// 🔵 Helper: Format relative time (e.g., "2m", "1h", "3d")
const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
};

// 🔵 Helper: Format message timestamp (e.g., "2:30 PM")
const formatMessageTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// 🔵 Helper: Get initials from display name
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return name[0];
};

function MessageModal({ onClose }) {
  // 🔵 Get state and actions from context
  const { 
    conversations, 
    selectedUserId,
    selectedMessages,
    selectedConversation,
    selectConversation, 
    sendMessage,
    getDisplayName,
    getInitials: contextGetInitials
  } = useMessages();
  
  // 🔵 Local state for the text input
  const [messageText, setMessageText] = useState('');
  
  // 🔵 Local state for search filtering
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🔵 New message mode - search for any user to message
  const [isNewMessageMode, setIsNewMessageMode] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // 🔵 Mobile view state - 'list' shows conversations, 'chat' shows the chat
  const [mobileView, setMobileView] = useState('list');
  
  // 🔵 Fullscreen mode state
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 🔵 Ref for scrolling to bottom of messages
  const messagesEndRef = useRef(null);
  
  // 🔵 Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedMessages]);
  
  // 🔵 Search for users when typing in new message mode
  useEffect(() => {
    if (!isNewMessageMode || !userSearchQuery.trim()) {
      setUserSearchResults([]);
      return;
    }
    
    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await usersService.searchUsers(userSearchQuery);
        setUserSearchResults(results);
      } catch (err) {
        console.error('User search failed:', err);
        setUserSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce search
    
    return () => clearTimeout(searchTimeout);
  }, [userSearchQuery, isNewMessageMode]);
  
  // 🔵 Handle selecting a user from search results
  const handleSelectUser = (user) => {
    // Pass user info so it can be displayed even without existing conversation
    selectConversation(user.id, {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      displayName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
    });
    setIsNewMessageMode(false);
    setUserSearchQuery('');
    setUserSearchResults([]);
    setMobileView('chat');
  };
  
  // 🔵 Calculate charge level (0-4) based on message length
  // This creates the "charging up" visual effect on the send button
  const getChargeLevel = () => {
    const len = messageText.length;
    if (len === 0) return 0;
    if (len < 10) return 1;
    if (len < 30) return 2;
    if (len < 60) return 3;
    return 4; // Fully charged
  };
  
  // 🔵 Handle sending a message
  const handleSend = () => {
    if (!messageText.trim()) return;
    
    // Call context function to add message
    sendMessage(messageText);
    
    // Clear the input
    setMessageText('');
  };
  
  // 🔵 Handle Enter key to send (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // 🔵 Filter conversations based on search query
  const filteredConversations = (conversations || []).filter((conv) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Match by display name or name
    const displayName = conv.user?.displayName || conv.user?.first_name || conv.user?.username || '';
    if (displayName.toLowerCase().includes(query)) return true;
    
    // Match by username
    if (conv.user?.username?.toLowerCase().includes(query)) return true;
    
    // Match by last message content
    if (conv.last_message?.content?.toLowerCase().includes(query)) return true;
    
    return false;
  });
  
  return (
    <div className="message-modal-overlay" onClick={onClose}>
      <div className={`message-modal ${isFullscreen ? 'fullscreen' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="message-modal-header">
          <h2 className="message-modal-title">Messages</h2>
          <div className="modal-header-actions">
            <button 
              className="fullscreen-btn" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <MinimizeIcon size={20} />
              ) : (
                <MaximizeIcon size={20} />
              )}
            </button>
            <button className="close-btn-glow" onClick={onClose}>
              <CloseIcon size={24} />
            </button>
          </div>
        </div>

        {/* Body - Two column layout */}
        <div className="message-modal-body">
          {/* Left: Conversations List */}
          <div className={`message-conversations ${mobileView === 'list' ? 'show' : ''}`}>
            <div className="conversations-header">
              {/* New Message Button */}
              <button 
                className={`new-message-btn ${isNewMessageMode ? 'active' : ''}`}
                onClick={() => setIsNewMessageMode(!isNewMessageMode)}
                title="New message"
              >
                <PlusIcon size={22} />
              </button>
              
              {/* User Search (when in new message mode) */}
              {isNewMessageMode ? (
                <div className="conversations-search-wrapper">
                  <input 
                    type="text"
                    id="user-search"
                    name="user-search"
                    autoComplete="off"
                    placeholder="Search users to message..." 
                    className="conversations-search"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsNewMessageMode(false);
                        setUserSearchQuery('');
                      }
                    }}
                    autoFocus
                  />
                  {userSearchQuery && (
                    <button 
                      className="conversations-search-clear"
                      onClick={() => setUserSearchQuery('')}
                      title="Clear search"
                    >
                      <CloseIcon size={14} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="conversations-search-wrapper">
                  <input 
                    type="text"
                    id="conversations-search"
                    name="conversations-search"
                    autoComplete="off"
                    placeholder="Search conversations..." 
                    className="conversations-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setSearchQuery('');
                    }}
                  />
                {searchQuery && (
                  <button 
                    className="conversations-search-clear"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    <CloseIcon size={14} />
                  </button>
                )}
              </div>
              )}
            </div>
            
            {/* User Search Results (new message mode) */}
            {isNewMessageMode ? (
              <div className="conversations-list">
                {isSearching && (
                  <div className="conversations-empty">
                    <p>Searching...</p>
                  </div>
                )}
                
                {!isSearching && userSearchResults.length > 0 && userSearchResults.map((user) => {
                  const displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
                  return (
                    <div 
                      key={user.id}
                      className="conversation-item"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="conversation-avatar">
                        <span className="initial-1">{getInitials(displayName)[0]}</span>
                        {getInitials(displayName).length > 1 && (
                          <span className="initial-2">{getInitials(displayName)[1]}</span>
                        )}
                      </div>
                      <div className="conversation-info">
                        <span className="conversation-name">{displayName}</span>
                        <span className="conversation-preview">@{user.username}</span>
                      </div>
                    </div>
                  );
                })}
                
                {!isSearching && userSearchQuery.trim() && userSearchResults.length === 0 && (
                  <div className="conversations-empty">
                    <p>No users found</p>
                    <p className="empty-hint">Try a different search</p>
                  </div>
                )}
                
                {!isSearching && !userSearchQuery.trim() && (
                  <div className="conversations-empty">
                    <p>Search for users</p>
                    <p className="empty-hint">Type a name or username</p>
                  </div>
                )}
              </div>
            ) : (
            <div className="conversations-list">
              {/* 🔵 Map through filtered conversations from context */}
              {filteredConversations.map((conv) => {
                // Support both API format (last_message) and mock format (messages array)
                const lastMessage = conv.last_message || (conv.messages && conv.messages[conv.messages.length - 1]);
                const displayName = conv.user?.displayName || `${conv.user?.first_name || ''} ${conv.user?.last_name || ''}`.trim() || conv.user?.username || 'Unknown';
                const isActive = conv.user?.id === selectedUserId;
                const messagePreview = lastMessage?.content || lastMessage?.text || 'No messages yet';
                
                return (
                  <div 
                    key={conv.id || conv.user?.id}
                    className={`conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      selectConversation(conv.user?.id);
                      setMobileView('chat'); // Switch to chat view on mobile
                    }}
                  >
                    {/* Avatar - show initials */}
                    <div className="conversation-avatar">
                      <span className="initial-1">{getInitials(displayName)[0]}</span>
                      {getInitials(displayName).length > 1 && (
                        <span className="initial-2">{getInitials(displayName)[1]}</span>
                      )}
                    </div>
                    <div className="conversation-info">
                      <span className="conversation-name">{displayName}</span>
                      <span className="conversation-preview">
                        {messagePreview.substring(0, 30) + (messagePreview.length > 30 ? '...' : '')}
                      </span>
                    </div>
                    <span className="conversation-time">
                      {formatRelativeTime(lastMessage?.created_at || conv.lastMessageTime)}
                    </span>
                  </div>
                );
              })}
              
              {/* Empty state - no search results */}
              {filteredConversations.length === 0 && searchQuery.trim() && (
                <div className="conversations-empty">
                  <p>No results for "{searchQuery}"</p>
                  <p className="empty-hint">Try a different search term</p>
                </div>
              )}
              
              {/* Empty state - no conversations at all */}
              {conversations.length === 0 && (
                <div className="conversations-empty">
                  <p>No conversations yet</p>
                  <p className="empty-hint">Click "New" to message someone!</p>
                </div>
              )}
            </div>
            )}
          </div>

          {/* Right: Chat View */}
          <div className={`message-chat ${mobileView === 'list' ? 'hide' : ''}`}>
            {selectedConversation ? (() => {
              // Get display name for the selected conversation user
              const chatDisplayName = selectedConversation.user?.displayName || 
                `${selectedConversation.user?.first_name || ''} ${selectedConversation.user?.last_name || ''}`.trim() || 
                selectedConversation.user?.username || 'Unknown';
              
              return (
              <>
                {/* Chat Header */}
                <div className="chat-header">
                  {/* Mobile back button */}
                  <button 
                    className="chat-back-btn"
                    onClick={() => setMobileView('list')}
                  >
                    <ChevronLeftIcon size={20} />
                  </button>
                  <div className="chat-user-info">
                    <div className="chat-avatar">
                      <span className="initial-1">{getInitials(chatDisplayName)[0]}</span>
                      {getInitials(chatDisplayName).length > 1 && (
                        <span className="initial-2">{getInitials(chatDisplayName)[1]}</span>
                      )}
                    </div>
                    <span className="chat-username">{chatDisplayName}</span>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="chat-messages">
                  {(selectedMessages || []).map((msg) => {
                    // Determine if message is sent by current user
                    const isSent = msg.sender === 'me' || msg.sender?.id !== selectedUserId;
                    const messageContent = msg.content || msg.text || '';
                    const messageTime = msg.created_at || msg.timestamp;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`chat-message ${isSent ? 'sent' : 'received'}`}
                      >
                        <p>{messageContent}</p>
                        <span className="message-time">{formatMessageTime(messageTime)}</span>
                      </div>
                    );
                  })}
                  
                  {/* Empty conversation state */}
                  {(!selectedMessages || selectedMessages.length === 0) && (
                    <div className="chat-empty">
                      <p>Start a conversation with {chatDisplayName}</p>
                    </div>
                  )}
                  
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Composer */}
                <div className="chat-composer">
                  <textarea 
                    placeholder="Type a message..." 
                    className="chat-textarea"
                    rows="1"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button 
                    className={`chat-send-btn charge-${getChargeLevel()}`}
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                  >
                    <ChevronRightIcon size={26} className="send-icon" strokeWidth="2.5" />
                  </button>
                </div>
              </>
              );
            })() : (
              /* No conversation selected state */
              <div className="chat-no-selection">
                <div className="no-selection-icon">
                  <MessageBubbleIcon size={48} stroke="rgba(201,168,255,0.4)" strokeWidth="1.5" />
                </div>
                <p>Select a conversation</p>
                <p className="no-selection-hint">or message someone from their post</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
