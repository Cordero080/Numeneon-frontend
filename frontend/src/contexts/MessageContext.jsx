// 🔵 PABLO - UI Architect
// MessageContext.jsx - Shared state for messaging system (API-connected)
//
// UPDATED WITH WEBSOCKETS 
// Now receives real-time message notifications instead of polling

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useWebSocket } from "./WebSocketContext";
import messagesService from "@services/messagesService";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const { subscribe } = useWebSocket();

  // Modal visibility
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Conversations list from API
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Currently selected conversation
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null); // Store user info for new conversations

  // NEW: Notification state for new messages
  const [newMessageNotification, setNewMessageNotification] = useState(null);

  // Fetch conversations when user logs in, clear on logout
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConversations();
    } else {
      setConversations([]);
      setSelectedUserId(null);
      setSelectedMessages([]);
    }
  }, [isAuthenticated, user]);

  // ✨ WEBSOCKET: Listen for new message events
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribe('new_message', (data) => {
      console.log('📩 New message from:', data.sender.username);
      
      const senderId = data.sender.id;

      // If this is the currently open conversation, add message immediately
      if (selectedUserId === senderId) {
        setSelectedMessages(prev => [...prev, {
          id: data.id,
          sender: data.sender,
          content: data.content,
          created_at: data.created_at,
          is_read: false,
        }]);
      }

      // Refresh conversations to update last_message and unread count
      fetchConversations();

      // Show notification (unless it's the currently open conversation)
      if (selectedUserId !== senderId) {
        setNewMessageNotification({
          senderId: senderId,
          senderUsername: data.sender.username,
          content: data.content,
        });

        // Clear notification after 5 seconds
        setTimeout(() => {
          setNewMessageNotification(null);
        }, 5000);
      }
    });

    return unsubscribe;
  }, [user, subscribe, selectedUserId]);

  // GET /api/messages/conversations/ - Load all conversations
  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await messagesService.getConversations();
      setConversations(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch conversations");
      console.error("Failed to fetch conversations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // GET /api/messages/conversation/?user_id=X - Load messages for one conversation
  const fetchConversation = async (userId) => {
    try {
      const messages = await messagesService.getConversation(userId);
      setSelectedMessages(messages || []);
      setSelectedUserId(userId);
    } catch (err) {
      // If no conversation exists yet, just set empty messages and the user ID
      // This allows starting a new conversation
      console.log("No existing conversation, starting fresh");
      setSelectedMessages([]);
      setSelectedUserId(userId);
    }
  };

  // Open the messages modal
  const openMessages = async (targetUser = null) => {
    setIsMessageModalOpen(true);

    if (targetUser) {
      // Use selectConversation which properly handles new conversations
      await selectConversation(targetUser.id, targetUser);
    } else if (conversations.length > 0 && !selectedUserId) {
      await selectConversation(conversations[0].user.id);
    }
  };

  const closeMessages = () => {
    setIsMessageModalOpen(false);
  };

  // Select a conversation and mark as read
  const selectConversation = async (userId, userInfo = null) => {
    console.log("selectConversation called:", { userId, userInfo });
    // Set user info FIRST so it's available immediately
    if (userInfo) {
      console.log("Setting selectedUserInfo:", userInfo);
      setSelectedUserInfo(userInfo);
    }
    // Set the user ID immediately so UI updates
    console.log("Setting selectedUserId:", userId);
    setSelectedUserId(userId);
    setSelectedMessages([]);
    
    // Then fetch existing messages (if any)
    try {
      const messages = await messagesService.getConversation(userId);
      setSelectedMessages(messages || []);
    } catch (err) {
      console.log("No existing conversation, starting fresh");
      // Already set empty messages above
    }
    
    // Mark as read (don't block on this)
    try {
      await messagesService.markAllAsRead(userId);
      fetchConversations();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // POST /api/messages/ - Send a message
  const sendMessage = async (text) => {
    if (!text.trim() || !selectedUserId) return { success: false };

    try {
      const newMessage = await messagesService.sendMessage(
        selectedUserId,
        text.trim()
      );

      // Optimistically add to local state
      setSelectedMessages((prev) => [...prev, newMessage]);

      // Refresh conversations to update last_message preview
      fetchConversations();

      return { success: true };
    } catch (err) {
      console.error("Failed to send message:", err);
      return {
        success: false,
        error: err.response?.data?.detail || "Failed to send",
      };
    }
  };

  // Find the conversation object for the currently selected user
  // Using useMemo to ensure proper React dependency tracking
  const selectedConversation = useMemo(() => {
    console.log("useMemo recomputing selectedConversation:", { 
      selectedUserId, 
      selectedUserInfo, 
      conversationsCount: conversations.length 
    });
    const existing = conversations.find((c) => c.user.id === selectedUserId);
    if (existing) {
      console.log("Found existing conversation:", existing);
      return existing;
    }
    
    // If no existing conversation but we have user info, create a fake conversation object
    // This allows the UI to display properly for new conversations
    if (selectedUserId && selectedUserInfo) {
      const fakeConv = {
        user: selectedUserInfo,
        messages: selectedMessages,
        last_message: null,
      };
      console.log("Created fake conversation:", fakeConv);
      return fakeConv;
    }
    console.log("No conversation found, returning null");
    return null;
  }, [conversations, selectedUserId, selectedUserInfo, selectedMessages]);

  // Helper: Build display name from user object
  const getDisplayName = (userObj) => {
    if (!userObj) return "Unknown";
    if (userObj.first_name && userObj.last_name) {
      return `${userObj.first_name} ${userObj.last_name}`;
    }
    return userObj.username;
  };

  // Helper: Get initials for avatar display
  const getInitials = (userObj) => {
    if (!userObj) return "??";
    if (userObj.first_name && userObj.last_name) {
      return `${userObj.first_name[0]}${userObj.last_name[0]}`.toUpperCase();
    }
    return userObj.username.slice(0, 2).toUpperCase();
  };

  return (
    <MessageContext.Provider
      value={{
        // State
        isMessageModalOpen,
        isLoading,
        error,
        conversations,
        selectedUserId,
        selectedMessages,
        selectedConversation,
        newMessageNotification,

        // Actions
        openMessages,
        closeMessages,
        selectConversation,
        sendMessage,
        fetchConversations,

        // Helpers
        getDisplayName,
        getInitials,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
}