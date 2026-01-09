// =============================================================================
// 🔵 PABLO - UI Architect
// MessageModal.jsx - Full-screen messaging modal with blurred backdrop
// =============================================================================
//
// ┌────────────────────────────────────────────────────────────────────────────┐
// │ Messages                                              [□] [✕]             │
// ├──────────────────────────┬─────────────────────────────────────────────────┤
// │ [🔍 Search...]           │  [←] 🔵 Display Name                           │
// │─────────────────────────│─────────────────────────────────────────────────│
// │ 🔵 Arthur B       2m    │     ┌───────────────────┐                       │
// │    Hey! Are you...      │     │ Their message     │  (received)           │
// │─────────────────────────│     └───────────────────┘                       │
// │ 🔵 Natalia P      1h    │                   ┌───────────────────┐         │
// │    That sounds...       │                   │   Your reply      │ (sent)  │
// │─────────────────────────│                   └───────────────────┘         │
// │ 🔵 Colin W        1d    │                                                 │
// │    Let's build...       │                                                 │
// ├──────────────────────────┼─────────────────────────────────────────────────┤
// │                          │ [Type a message...____________] [➤ charge-N]   │
// └──────────────────────────┴─────────────────────────────────────────────────┘
//
// =============================================================================

import { useState, useRef, useEffect } from 'react';
import { MinimizeIcon, MaximizeIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon, MessageBubbleIcon } from '@assets/icons';
import { useMessages } from '@contexts/MessageContext';
import './MessageModal.scss';

// HELPER: Format relative time (e.g., "2m", "1h", "3d")
const formatRelativeTime = (date) => {
  // TODO: Calculate time difference from now
  // - < 1 min: return 'now'
  // - < 60 min: return `${minutes}m`
  // - < 24 hours: return `${hours}h`
  // - else: return `${days}d`
};

// HELPER: Format message timestamp (e.g., "2:30 PM")
const formatMessageTime = (date) => {
  // TODO: Return localized time string
  // Hint: toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
};

// HELPER: Get initials from display name (e.g., "Arthur Bernier" → "AB")
const getInitials = (name) => {
  // TODO: Split name, return first letter of each word (max 2)
  // Handle edge cases: null, single word, empty string
};

function MessageModal({ onClose }) {
  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────────────────
  const { 
    conversations, 
    selectedConversationId, 
    selectedConversation,
    selectConversation, 
    sendMessage 
  } = useMessages();
  
  // ─────────────────────────────────────────────────────────────────────────
  // LOCAL STATE
  // ─────────────────────────────────────────────────────────────────────────
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef(null);
  
  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // TODO: Auto-scroll to bottom when messages change
    // Hint: messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation?.messages]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────────────────
  const getChargeLevel = () => {
    // TODO: Return 0-4 based on messageText.length
    // 0 chars = 0, <10 = 1, <30 = 2, <60 = 3, else = 4
    // This powers the "charging up" visual effect on send button
  };
  
  const filteredConversations = conversations.filter((conv) => {
    // TODO: Filter by searchQuery matching displayName, username, or message content
    // If no query, return all
  });
  
  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  const handleSend = () => {
    // TODO: If messageText is empty, return early
    // TODO: Call sendMessage(messageText) from context
    // TODO: Clear messageText
  };
  
  const handleKeyDown = (e) => {
    // TODO: If Enter (without Shift), prevent default and call handleSend
    // Shift+Enter should allow newline
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="message-modal-overlay" onClick={onClose}>
      <div className={`message-modal ${isFullscreen ? 'fullscreen' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HEADER                                                              */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="message-modal-header">
          <h2 className="message-modal-title">Messages</h2>
          <div className="modal-header-actions">
            <button 
              className="fullscreen-btn" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <MinimizeIcon size={20} /> : <MaximizeIcon size={20} />}
            </button>
            <button className="close-btn-glow" onClick={onClose}>
              <CloseIcon size={24} />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* BODY - Two Column Layout                                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="message-modal-body">
          
          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* LEFT COLUMN: Conversations List                                     */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <div className={`message-conversations ${mobileView === 'list' ? 'show' : ''}`}>
            <div className="conversations-header">
              <div className="conversations-search-wrapper">
                <input 
                  type="text" 
                  placeholder="Search conversations..." 
                  className="conversations-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
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
              {filteredConversations.map((conv) => {
                const lastMessage = conv.messages[conv.messages.length - 1];
                const isActive = conv.id === selectedConversationId;
                
                return (
                  <div 
                    key={conv.id}
                    className={`conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      selectConversation(conv.id);
                      setMobileView('chat');
                    }}
                  >
                    <div className="conversation-avatar">
                      <span className="initial-1">{/* TODO: First initial */}</span>
                      <span className="initial-2">{/* TODO: Second initial (if exists) */}</span>
                    </div>
                    <div className="conversation-info">
                      <span className="conversation-name">{conv.user.displayName}</span>
                      <span className="conversation-preview">
                        {/* TODO: Show preview of last message (truncate to 30 chars) */}
                      </span>
                    </div>
                    <span className="conversation-time">
                      {/* TODO: formatRelativeTime(conv.lastMessageTime) */}
                    </span>
                  </div>
                );
              })}
              
              {/* Empty States */}
              {filteredConversations.length === 0 && searchQuery.trim() && (
                <div className="conversations-empty">
                  <p>No results for "{searchQuery}"</p>
                  <p className="empty-hint">Try a different search term</p>
                </div>
              )}
              
              {conversations.length === 0 && (
                <div className="conversations-empty">
                  <p>No conversations yet</p>
                  <p className="empty-hint">Message someone from their post!</p>
                </div>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* RIGHT COLUMN: Chat View                                             */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <div className={`message-chat ${mobileView === 'list' ? 'hide' : ''}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="chat-header">
                  <button className="chat-back-btn" onClick={() => setMobileView('list')}>
                    <ChevronLeftIcon size={20} />
                  </button>
                  <div className="chat-user-info">
                    <div className="chat-avatar">
                      <span className="initial-1">{/* TODO */}</span>
                      <span className="initial-2">{/* TODO */}</span>
                    </div>
                    <span className="chat-username">{selectedConversation.user.displayName}</span>
                  </div>
                </div>
                
                {/* Messages List */}
                <div className="chat-messages">
                  {selectedConversation.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`chat-message ${msg.sender === 'me' ? 'sent' : 'received'}`}
                    >
                      <p>{msg.text}</p>
                      <span className="message-time">{/* TODO: formatMessageTime */}</span>
                    </div>
                  ))}
                  
                  {selectedConversation.messages.length === 0 && (
                    <div className="chat-empty">
                      <p>Start a conversation with {selectedConversation.user.displayName}</p>
                    </div>
                  )}
                  
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
