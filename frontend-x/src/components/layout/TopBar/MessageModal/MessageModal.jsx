// 🔵 PABLO - UI Architect
// MessageModal.jsx - Full-screen messaging modal with blurred backdrop
//
// This component now:
// 1. Uses MessageContext for state (conversations, messages from API)
// 2. Clicking a conversation in the sidebar switches the active chat
// 3. Typing and clicking send POSTs to the real API
// 4. Shows real messages fetched from backend

import { useState, useRef, useEffect } from 'react';
import { MinimizeIcon, MaximizeIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon, MessageBubbleIcon } from '@assets/icons';
import { useMessages } from '@contexts/MessageContext';
import { useAuth } from '@contexts/AuthContext';
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

function MessageModal({ onClose }) {
  // 🔵 Get current user for comparing sender IDs
  const { user } = useAuth();

  // 🔵 Get state and actions from context
  const { 
    conversations,
    selectedUserId,
    selectedMessages,
    selectedConversation,
    selectConversation, 
    sendMessage,
    isLoading,
    getDisplayName,
    getInitials,
  } = useMessages();
  
  // 🔵 Local state for the text input
  const [messageText, setMessageText] = useState('');
  
  // 🔵 Local state for search filtering
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  // 🔵 Handle sending a message (now async)
  const handleSend = async () => {
    if (!messageText.trim()) return;
    
    // Call context function to POST message to API
    const result = await sendMessage(messageText);
    
    // Clear the input only on success
    if (result.success) {
      setMessageText('');
    }
  };
  
  // 🔵 Handle Enter key to send (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // 🔵 Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Match by display name (built from first_name + last_name)
    const displayName = getDisplayName(conv.user);
    if (displayName.toLowerCase().includes(query)) return true;
    
    // Match by username
    if (conv.user.username?.toLowerCase().includes(query)) return true;
    
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
              <div className="conversations-search-wrapper">
                <input 
                  type="text" 
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
            </div>
            <div className="conversations-list">
              {/* Loading state */}
              {isLoading && (
                <div className="conversations-empty">
                  <p>Loading conversations...</p>
                </div>
              )}

              {/* 🔵 Map through filtered conversations from API */}
              {!isLoading && filteredConversations.map((conv) => {
                const isActive = conv.user.id === selectedUserId;
                const initials = getInitials(conv.user);
                const displayName = getDisplayName(conv.user);
                const previewText = conv.last_message?.content || 'No messages yet';
                
                return (
                  <div 
                    key={conv.user.id}
                    className={`conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      selectConversation(conv.user.id);
                      setMobileView('chat'); // Switch to chat view on mobile
                    }}
                  >
                    {/* Avatar - show initials */}
                    <div className="conversation-avatar">
                      <span className="initial-1">{initials[0]}</span>
                      {initials.length > 1 && (
                        <span className="initial-2">{initials[1]}</span>
                      )}
                    </div>
                    <div className="conversation-info">
                      <span className="conversation-name">{displayName}</span>
                      <span className="conversation-preview">
                        {previewText.substring(0, 30) + (previewText.length > 30 ? '...' : '')}
                      </span>
                    </div>
                    <div className="conversation-meta">
                      <span className="conversation-time">
                        {formatRelativeTime(conv.last_message?.created_at)}
                      </span>
                      {conv.unread_count > 0 && (
                        <span className="unread-badge">{conv.unread_count}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Empty state - no search results */}
              {!isLoading && filteredConversations.length === 0 && searchQuery.trim() && (
                <div className="conversations-empty">
                  <p>No results for "{searchQuery}"</p>
                  <p className="empty-hint">Try a different search term</p>
                </div>
              )}
              
              {/* Empty state - no conversations at all */}
              {!isLoading && conversations.length === 0 && (
                <div className="conversations-empty">
                  <p>No conversations yet</p>
                  <p className="empty-hint">Message someone from their post!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Chat View */}
          <div className={`message-chat ${mobileView === 'list' ? 'hide' : ''}`}>
            {selectedConversation ? (
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
                      <span className="initial-1">{getInitials(selectedConversation.user)[0]}</span>
                      {getInitials(selectedConversation.user).length > 1 && (
                        <span className="initial-2">{getInitials(selectedConversation.user)[1]}</span>
                      )}
                    </div>
                    <span className="chat-username">{getDisplayName(selectedConversation.user)}</span>
                  </div>
                </div>
                
                {/* Messages - now from selectedMessages, not selectedConversation.messages */}
                <div className="chat-messages">
                  {selectedMessages.map((msg) => {
                    // Compare sender.id to current user.id instead of 'me'/'them' string
                    const isMe = msg.sender.id === user.id;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`chat-message ${isMe ? 'sent' : 'received'}`}
                      >
                        <p>{msg.content}</p>
                        <span className="message-time">{formatMessageTime(msg.created_at)}</span>
                      </div>
                    );
                  })}
                  
                  {/* Empty conversation state */}
                  {selectedMessages.length === 0 && (
                    <div className="chat-empty">
                      <p>Start a conversation with {getDisplayName(selectedConversation.user)}</p>
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
            ) : (
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