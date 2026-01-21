/**
 * =============================================================================
 * FRIENDS CONTEXT
 * =============================================================================
 * 
 * File: frontend/src/contexts/FriendsContext.jsx
 * Assigned to: CRYSTAL
 * Responsibility: Global friends state management
 * 
 * Status: IMPLEMENTED ✅
 * =============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import friendsService from '@services/friendsService';
import { useAuth } from './AuthContext';

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth(); // Get auth state
  
  // STATE
  const [friends, setFriends] = useState([]);           // Confirmed friends
  const [pendingRequests, setPendingRequests] = useState([]); // Incoming requests waiting for response
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // FETCH WHEN USER LOGS IN (and auth is done loading)
  useEffect(() => {
    console.log('FriendsContext useEffect - user:', user, 'authLoading:', authLoading);
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return; // Wait for auth to finish
    }
    if (user) {
      console.log('User exists, fetching friends...');
      fetchFriends();
    } else {
      // Clear data when logged out
      setFriends([]);
      setPendingRequests([]);
    }
  }, [user, authLoading]);

  // FETCH FRIENDS LIST
  const fetchFriends = async () => {
    console.log('fetchFriends called');
    setIsLoading(true);
    setError(null);
    try {
      // Fetch friends and pending requests in parallel
      const [friendsData, pendingData] = await Promise.all([
        friendsService.getAll(),
        friendsService.getPendingRequests(),
      ]);
      console.log('API Response - friends:', friendsData, 'pending:', pendingData);
      setFriends(friendsData);
      setPendingRequests(pendingData);
    } catch (err) {
      console.error('fetchFriends error:', err);
      setError(err.response?.data?.detail || 'Failed to fetch friends');
    } finally {
      setIsLoading(false);
    }
  };

  // SEND FRIEND REQUEST
  const sendRequest = async (userId) => {
    try {
      await friendsService.sendRequest(userId);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Failed to send request' 
      };
    }
  };

  // ACCEPT REQUEST
  const acceptRequest = async (requestId) => {
    try {
      const newFriend = await friendsService.acceptRequest(requestId);
      setFriends(prev => [...prev, newFriend]); // Add to friends list
      setPendingRequests(prev => prev.filter(req => req.id !== requestId)); // Remove from pending
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Failed to accept request' 
      };
    }
  };

  // DECLINE REQUEST
  const declineRequest = async (requestId) => {
    try {
      await friendsService.declineRequest(requestId);
      setPendingRequests(prev => prev.filter(req => req.id !== requestId)); // Remove from pending
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Failed to decline request' 
      };
    }
  };

  // REMOVE FRIEND
  const removeFriend = async (userId) => {
    try {
      await friendsService.remove(userId);
      setFriends(prev => prev.filter(friend => friend.id !== userId)); // Remove from list
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Failed to remove friend' 
      };
    }
  };

  return (
    <FriendsContext.Provider
      value={{
        // State
        friends,
        pendingRequests,
        isLoading,
        error,
        // Actions
        fetchFriends,
        sendRequest,
        acceptRequest,
        declineRequest,
        removeFriend,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};

export default FriendsContext;