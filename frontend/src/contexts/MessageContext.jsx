// 🔵 PABLO - UI Architect
// MessageContext.jsx - Shared state for messaging system (API-connected)
//
// This context manages:
// - Modal open/close state
// - List of conversations (fetched from /api/messages/conversations/)
// - Currently selected conversation and its messages
// - Functions to send messages and mark as read
// - Loading and error states for async operations

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import messagesService from "@services/messagesService";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  // Get current user to determine authentication status
  const { user, isAuthenticated } = useAuth();

  // Modal visibility
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Conversations list from API (each has: user, last_message, unread_count)
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Currently selected conversation - tracked by user ID, not conversation ID
  // Messages are fetched separately when a conversation is selected
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);

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
      setSelectedMessages(messages);
      setSelectedUserId(userId);
    } catch (err) {
      console.error("Failed to fetch conversation:", err);
    }
  };

  // Open the messages modal, optionally selecting a specific user's conversation
  const openMessages = async (targetUser = null) => {
    setIsMessageModalOpen(true);

    if (targetUser) {
      await fetchConversation(targetUser.id);
    } else if (conversations.length > 0 && !selectedUserId) {
      // Default to first conversation if none selected
      await fetchConversation(conversations[0].user.id);
    }
  };

  const closeMessages = () => {
    setIsMessageModalOpen(false);
  };

  // Select a conversation and mark its messages as read
  const selectConversation = async (userId) => {
    await fetchConversation(userId);
    try {
      await messagesService.markAllAsRead(userId);
      fetchConversations(); // Refresh to update unread counts
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // POST /api/messages/ - Send a message to the selected user
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
  const getSelectedConversation = () => {
    return conversations.find((c) => c.user.id === selectedUserId) || null;
  };

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
        selectedConversation: getSelectedConversation(),

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