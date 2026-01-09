// =============================================================================
// 🟣 CRYSTAL - Friends Lead
// FriendsContext.jsx - Global friends state management
// =============================================================================
//
// TODO: Create a context that manages friends and friend requests
//
// This context tracks who you're friends with and pending requests.
//
// STATE:
// - friends: Array of friend user objects (confirmed friendships)
// - pendingRequests: Array of incoming friend requests waiting for response
// - isLoading: Boolean, true while fetching
// - error: Error message string or null
//
// FUNCTIONS TO PROVIDE:
// - fetchFriends(): Get friends list AND pending requests
// - sendRequest(userId): Send friend request to another user
// - acceptRequest(requestId): Accept incoming friend request
// - declineRequest(requestId): Decline incoming friend request
// - removeFriend(userId): Remove existing friend
//
// FETCH ON AUTH:
// - useEffect that watches AuthContext's user state
// - When user logs in, fetch friends and pending requests
// - When user logs out, clear both arrays
//
// STATE UPDATES:
// - acceptRequest: Add new friend to friends[], remove from pendingRequests[]
// - declineRequest: Remove from pendingRequests[]
// - removeFriend: Remove from friends[]
//
// Think about:
// - Friends list shows confirmed friendships
// - Pending requests are INCOMING (others requesting to be your friend)
// - Outgoing requests (you sent) are not tracked here (could be future feature)
//
// Hint: const { user, isLoading: authLoading } = useAuth();
// Hint: Use Promise.all to fetch friends and pending in parallel
// Hint: Always return { success, error } from async functions
// =============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import friendsService from '@services/friendsService';
import { useAuth } from './AuthContext';

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
  // TODO: Get auth state from AuthContext
  // const { user, isLoading: authLoading } = useAuth();

  // TODO: Set up state
  // const [friends, setFriends] = useState([]);
  // const [pendingRequests, setPendingRequests] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  // TODO: useEffect to fetch when user logs in
  // Hint: if (authLoading) return;
  // Hint: if (user) fetchFriends();
  // Hint: else { setFriends([]); setPendingRequests([]); }

  // TODO: Implement fetchFriends
  // Hint: const [friendsData, pendingData] = await Promise.all([...]);

  // TODO: Implement sendRequest(userId)

  // TODO: Implement acceptRequest(requestId)
  // Hint: setFriends(prev => [...prev, newFriend]);
  // Hint: setPendingRequests(prev => prev.filter(req => req.id !== requestId));

  // TODO: Implement declineRequest(requestId)

  // TODO: Implement removeFriend(userId)
  // Hint: setFriends(prev => prev.filter(friend => friend.id !== userId));

  // TODO: Return provider with all state and functions
  // Your code here
};

export const useFriends = () => {
  // TODO: Return useContext(FriendsContext) with error check
  // Your code here
};

export default FriendsContext;