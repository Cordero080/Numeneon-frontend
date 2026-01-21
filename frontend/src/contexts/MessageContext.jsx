// 🔵 PABLO - UI Architect
// MessageContext.jsx - Shared state for messaging system
// 
// This context manages:
// - Modal open/close state
// - List of conversations (mock data for now, would be API in production)
// - Currently selected conversation
// - Messages within each conversation
// - Functions to send messages and start new conversations

import { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

// 🔵 MOCK DATA - In production, this would come from an API
// Each conversation has: id, user info, and messages array
const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    user: {
      id: 1,
      username: 'arthurb',
      displayName: 'Arthur Bernier',
      avatar: null, // Will show initials
    },
    messages: [
      { id: 'm1', text: 'Hey! Are you coming to the meetup tonight?', sender: 'them', timestamp: new Date(Date.now() - 3600000) },
      { id: 'm2', text: 'Yes! I\'ll be there around 7', sender: 'me', timestamp: new Date(Date.now() - 3500000) },
    ],
    lastMessageTime: new Date(Date.now() - 3500000),
  },
  {
    id: 'conv-2',
    user: {
      id: 2,
      username: 'nataliap',
      displayName: 'Natalia P',
      avatar: null,
    },
    messages: [
      { id: 'm3', text: 'That sounds great!', sender: 'them', timestamp: new Date(Date.now() - 7200000) },
    ],
    lastMessageTime: new Date(Date.now() - 7200000),
  },
  {
    id: 'conv-3',
    user: {
      id: 3,
      username: 'colinw',
      displayName: 'Colin Weir',
      avatar: null,
    },
    messages: [
      { id: 'm4', text: 'Let\'s build something cool', sender: 'them', timestamp: new Date(Date.now() - 86400000) },
      { id: 'm5', text: 'I\'m in! What did you have in mind?', sender: 'me', timestamp: new Date(Date.now() - 85000000) },
      { id: 'm6', text: 'A social network with neon vibes 🔮', sender: 'them', timestamp: new Date(Date.now() - 84000000) },
    ],
    lastMessageTime: new Date(Date.now() - 84000000),
  },
  {
    id: 'conv-4',
    user: {
      id: 4,
      username: 'crystalr',
      displayName: 'Crystal Ruiz',
      avatar: null,
    },
    messages: [
      { id: 'm7', text: 'Thanks for the help!', sender: 'them', timestamp: new Date(Date.now() - 259200000) },
    ],
    lastMessageTime: new Date(Date.now() - 259200000),
  },
  {
    id: 'conv-5',
    user: {
      id: 5,
      username: 'titod',
      displayName: 'Tito',
      avatar: null,
    },
    messages: [
      { id: 'm8', text: '🔥🔥🔥', sender: 'them', timestamp: new Date(Date.now() - 172800000) },
      { id: 'm9', text: 'The new design is fire!', sender: 'me', timestamp: new Date(Date.now() - 170000000) },
    ],
    lastMessageTime: new Date(Date.now() - 170000000),
  },
];

export function MessageProvider({ children }) {
  // 🔵 Modal visibility state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  // 🔵 Conversations state - list of all conversations
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  
  // 🔵 Currently selected conversation (default to first conversation)
  const [selectedConversationId, setSelectedConversationId] = useState(
    INITIAL_CONVERSATIONS.length > 0 ? INITIAL_CONVERSATIONS[0].id : null
  );

  // 🔵 Open modal (optionally with a specific user to message)
  const openMessages = (targetUser = null) => {
    setIsMessageModalOpen(true);
    
    if (targetUser) {
      // Check if conversation with this user already exists
      const existingConv = conversations.find(c => c.user.username === targetUser.username);
      
      if (existingConv) {
        // Select existing conversation
        setSelectedConversationId(existingConv.id);
      } else {
        // Create new conversation
        const newConvId = `conv-${Date.now()}`;
        const newConv = {
          id: newConvId,
          user: {
            id: targetUser.id,
            username: targetUser.username,
            displayName: targetUser.displayName || targetUser.username,
            avatar: targetUser.avatar || null,
          },
          messages: [],
          lastMessageTime: new Date(),
        };
        setConversations(prev => [newConv, ...prev]);
        setSelectedConversationId(newConvId);
      }
    }
    // If no targetUser and nothing selected, the default from initial state handles it
  };
  
  const closeMessages = () => {
    setIsMessageModalOpen(false);
  };

  // 🔵 Select a conversation by ID
  const selectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  // 🔵 Send a message in the current conversation
  const sendMessage = (text) => {
    if (!text.trim() || !selectedConversationId) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      text: text.trim(),
      sender: 'me',
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessageTime: new Date(),
        };
      }
      return conv;
    }));
  };

  // 🔵 Get the currently selected conversation object
  const getSelectedConversation = () => {
    return conversations.find(c => c.id === selectedConversationId) || null;
  };

  // 🔵 Sort conversations by most recent message
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );

  return (
    <MessageContext.Provider value={{ 
      // State
      isMessageModalOpen, 
      conversations: sortedConversations,
      selectedConversationId,
      selectedConversation: getSelectedConversation(),
      
      // Actions
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
