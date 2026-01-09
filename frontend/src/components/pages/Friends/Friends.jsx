// =============================================================================
// 🟣 CRYSTAL - Friends Lead
// Friends.jsx - Friends list and requests page
// =============================================================================
//
// TODO: Create the friends management page
//
// This page displays three tabs:
// 1. All Friends - Shows your confirmed friends
// 2. Requests - Shows pending incoming friend requests
// 3. Suggestions - Shows suggested friends (mock data for now)
//
// STATE:
// - activeTab: 'all' | 'requests' | 'suggestions'
// - friendToRemove: Friend object (for delete confirmation modal)
// - isRemoving: Boolean loading state for removal
//
// DATA FROM CONTEXT:
// - friends: Array of friend objects
// - pendingRequests: Array of pending request objects
// - isLoading, error
// - acceptRequest, declineRequest, removeFriend functions
//
// FEATURES:
// 1. Tab navigation (3 tabs)
// 2. Friend cards with click to view profile
// 3. Message button (opens MessageModal via context)
// 4. Remove friend button with confirmation modal
// 5. Accept/Decline buttons on request cards
// 6. Suggestions tab with "Add" button (mock)
//
// HELPER FUNCTIONS:
// - getColorVariant(id): Assign color class based on friend id
// - getInitials(firstName, lastName, username): Get avatar initials
// - getDisplayName(friend): Get display name (username preferred)
//
// NAVIGATION:
// - Click friend card → navigate to /profile/:username
// - Click message button → openMessages() from MessageContext
//
// Think about:
// - Why use a confirmation modal for removal?
// - How do you stop click propagation on action buttons?
// - What should loading state look like?
//
// Hint: const { friends, pendingRequests, ... } = useFriends();
// Hint: const { openMessages } = useMessages();
// Hint: navigate(`/profile/${friend.username}`);
// =============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriends, useMessages } from '@contexts';
import DeleteConfirmModal from '@Home/components/DeleteConfirmModal/DeleteConfirmModal';
import { MessageBubbleIcon, UnlinkIcon, PlusIcon } from '@assets/icons';
import './Friends.scss';

// TODO: Create helper functions
// const getColorVariant = (id) => {...}
// const getInitials = (firstName, lastName, username) => {...}
// const getDisplayName = (friend) => {...}

function Friends() {
  // TODO: Set up state
  // const [activeTab, setActiveTab] = useState('all');
  // const [friendToRemove, setFriendToRemove] = useState(null);
  // const [isRemoving, setIsRemoving] = useState(false);

  // TODO: Get hooks
  // const navigate = useNavigate();
  // const { friends, pendingRequests, isLoading, error, acceptRequest, declineRequest, removeFriend } = useFriends();
  // const { openMessages } = useMessages();

  // TODO: Mock suggestions data (future API feature)
  // const suggestions = [...];

  // TODO: Implement handlers
  // handleAccept, handleDecline, handleRemoveClick, handleConfirmRemove
  // handleFriendClick, handleMessageFriend

  // TODO: Return JSX with:
  // - Header with title and stats
  // - Tab navigation
  // - Conditional content based on activeTab:
  //   - 'all': Grid of friend cards with message/remove buttons
  //   - 'requests': Grid of request cards with accept/decline buttons
  //   - 'suggestions': Grid of suggestion cards with add button
  // - DeleteConfirmModal for remove confirmation

  return (
    <div className="friends-page">
      {/* Your code here */}
    </div>
  );
}

export default Friends;
