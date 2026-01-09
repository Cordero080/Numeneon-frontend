// =============================================================================
// 🔵 PABLO - UI Architect
// MessageContext.jsx - Shared state for messaging system
// =============================================================================
//
// TODO: Create a context that manages the messaging/DM system
//
// This context manages:
// - Modal open/close state
// - List of conversations (mock data for now, would be API in production)
// - Currently selected conversation
// - Messages within each conversation
// - Functions to send messages and start new conversations
//
// STATE:
// - isMessageModalOpen: Boolean
// - conversations: Array of conversation objects
// - selectedConversationId: String ID of current conversation
//
// FUNCTIONS:
// - openMessages(targetUser?): Open modal, optionally start/select conversation with user
// - closeMessages(): Close the modal
// - selectConversation(id): Switch to different conversation
// - sendMessage(text): Add message to current conversation
//
// CONVERSATION OBJECT:
// {
//   id: 'conv-1',
//   user: { id, username, displayName, avatar },
//   messages: [{ id, text, sender: 'me'|'them', timestamp }],
//   lastMessageTime: Date
// }
//
// OPEN WITH TARGET USER:
// - Check if conversation exists with that user
// - If yes, select that conversation
// - If no, create new conversation and select it
//
// MOCK DATA:
// - Include initial conversations with team members for demo
// - In production, this would come from an API
//
// Think about:
// - How do you sort conversations by most recent?
// - What happens when sending to a new user with no history?
// - Why separate selectedConversationId from selectedConversation?
// =============================================================================

import { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

// TODO: Create INITIAL_CONVERSATIONS mock data array
const INITIAL_CONVERSATIONS = [
  // { id: 'conv-1', user: {...}, messages: [...], lastMessageTime: new Date(...) },
];

export function MessageProvider({ children }) {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState(
    INITIAL_CONVERSATIONS.length > 0 ? INITIAL_CONVERSATIONS[0].id : null
  );

  const openMessages = (targetUser = null) => {
    // TODO: Set modal open
    // TODO: If targetUser provided:
    //   - Find existing conversation with that user
    //   - If found, select it
    //   - If not found, create new conversation and select it
  };
  
  const closeMessages = () => {
    // TODO: Close the modal
  };

  const selectConversation = (conversationId) => {
    // TODO: Update selectedConversationId
  };

  const sendMessage = (text) => {
    // TODO: If no text or no selected conversation, return early
    // TODO: Create message object: { id, text, sender: 'me', timestamp }
    // TODO: Update conversation's messages array and lastMessageTime
  };

  const getSelectedConversation = () => {
    // TODO: Return conversation matching selectedConversationId, or null
  };

  // TODO: Sort conversations by lastMessageTime (most recent first)
  const sortedConversations = [...conversations].sort(
    (a, b) => { /* TODO: Compare lastMessageTime */ }
  );

  return (
    <MessageContext.Provider value={{ 
      isMessageModalOpen, 
      conversations: sortedConversations,
      selectedConversationId,
      selectedConversation: getSelectedConversation(),
      openMessages, 
      closeMessages,
      selectConversation,
      sendMessage,
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}
