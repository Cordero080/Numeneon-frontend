// 🔵 PABLO - UI/Styling | 🟣 CRYSTAL - API Logic  
// Friends.jsx - Friends list and requests page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriends, useMessages } from '@contexts';
import DeleteConfirmModal from '@Home/components/DeleteConfirmModal/DeleteConfirmModal';
import { MessageBubbleIcon, UnlinkIcon, PlusIcon } from '@assets/icons';
import './Friends.scss';

// Helper function to assign color variants to cards
const getColorVariant = (id) => {
  const variants = ['card-cyan', 'card-magenta', 'card-green', 'card-purple', 'card-orange'];
  return variants[id % variants.length];
};

// Helper to get initials from name
const getInitials = (firstName, lastName, username) => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
};

// Helper to get display name - always use username
const getDisplayName = (friend) => {
  return friend.username || 'Unknown';
};

function Friends() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'requests', 'suggestions'
  const [friendToRemove, setFriendToRemove] = useState(null); // Friend being removed
  const [isRemoving, setIsRemoving] = useState(false); // Loading state
  const navigate = useNavigate();
  
  // Get data from context (connected to backend)
  const { 
    friends, 
    pendingRequests, 
    isLoading, 
    error,
    acceptRequest, 
    declineRequest, 
    removeFriend 
  } = useFriends();
  
  // Get message context for opening DMs
  const { openMessages } = useMessages();

  // Debug logging
  console.log('Friends page - friends:', friends, 'pending:', pendingRequests, 'loading:', isLoading, 'error:', error);

  // Suggestions are still mock for now (would need a different API)
  const suggestions = [
    { id: 201, name: 'Maya Patel', username: 'mayap', avatar: 'MP', mutualFriends: 5 },
    { id: 202, name: 'Jake Thompson', username: 'jaket', avatar: 'JT', mutualFriends: 2 },
    { id: 203, name: 'Emma Wilson', username: 'emmaw', avatar: 'EW', mutualFriends: 8 },
  ];

  // Handle accept friend request
  const handleAccept = async (requestId) => {
    const result = await acceptRequest(requestId);
    if (!result.success) {
      console.error('Failed to accept:', result.error);
    }
  };

  // Handle decline friend request
  const handleDecline = async (requestId) => {
    const result = await declineRequest(requestId);
    if (!result.success) {
      console.error('Failed to decline:', result.error);
    }
  };

  // Handle remove friend - show confirmation modal
  const handleRemoveClick = (e, friend) => {
    e.stopPropagation();
    setFriendToRemove(friend);
  };

  // Confirm remove friend
  const handleConfirmRemove = async () => {
    if (!friendToRemove) return;
    
    setIsRemoving(true);
    const result = await removeFriend(friendToRemove.id);
    setIsRemoving(false);
    
    if (!result.success) {
      console.error('Failed to remove:', result.error);
    }
    
    setFriendToRemove(null);
  };

  // Handle clicking on a friend card - navigate to their profile
  const handleFriendClick = (friend) => {
    navigate(`/profile/${friend.username}`);
  };

  // Handle clicking the message icon - open message modal with this friend
  const handleMessageFriend = (e, friend) => {
    e.stopPropagation(); // Prevent triggering card click
    openMessages({
      id: friend.id,
      username: friend.username,
      displayName: friend.first_name && friend.last_name 
        ? `${friend.first_name} ${friend.last_name}`
        : friend.username,
    });
  };

  if (isLoading) {
    return (
      <div className="friends-page">
        <div className="friends-header">
          <h1 className="friends-title">Friends</h1>
        </div>
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="friends-page">
      {/* Scan line overlay */}
      <div className="scan-overlay"></div>
      
      {/* Header - Centered with stats below */}
      <div className="friends-header">
        <h1 className="friends-title">Friends</h1>
        <div className="friends-stats">
          <span className="stat-item">
            <span className="stat-value">{friends.length}</span>
            <span className="stat-label">connected</span>
          </span>
          <span className="stat-dot"></span>
          <span className="stat-item">
            <span className="stat-value">{pendingRequests.length}</span>
            <span className="stat-label">pending</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="friends-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Friends
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests
          {pendingRequests.length > 0 && <span className="tab-badge">{pendingRequests.length}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </button>
      </div>

      {/* Content */}
      <div className="friends-content">
        {activeTab === 'all' && (
          <div className="friends-grid">
            {friends.map(friend => (
              <div 
                key={friend.id} 
                className={`friend-card card card-interactive ${getColorVariant(friend.id)}`}
                onClick={() => handleFriendClick(friend)}
                style={{ cursor: 'pointer' }}
              >
                <div className="scan-line"></div>
                <div className="friend-avatar">
                  <span>{getInitials(friend.first_name, friend.last_name, friend.username)}</span>
                  <div className="status-dot online"></div>
                </div>
                <div className="friend-info">
                  <h3 className="friend-name">{getDisplayName(friend)}</h3>
                  <span className="friend-username">@{friend.username}</span>
                </div>
                <button 
                  className="friend-action-btn" 
                  onClick={(e) => handleMessageFriend(e, friend)} 
                  title="Message friend"
                >
                  <MessageBubbleIcon size={20} />
                </button>
                <button 
                  className="friend-remove-btn" 
                  onClick={(e) => handleRemoveClick(e, friend)} 
                  title="Remove friend"
                >
                  <UnlinkIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="friends-grid">
            {pendingRequests.map(request => (
              <div 
                key={request.id} 
                className="friend-card card request-card"
                onClick={() => navigate(`/profile/${request.from_user.username}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="scan-line"></div>
                <div className="friend-avatar">
                  <span>{getInitials(request.from_user.first_name, request.from_user.last_name, request.from_user.username)}</span>
                </div>
                <div className="friend-info">
                  <h3 className="friend-name">{getDisplayName(request.from_user)}</h3>
                  <span className="friend-username">@{request.from_user.username}</span>
                </div>
                <div className="request-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-accept" onClick={() => handleAccept(request.id)}>Accept</button>
                  <button className="btn-decline" onClick={() => handleDecline(request.id)}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="friends-grid">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className="friend-card card suggestion-card">
                <div className="scan-line"></div>
                <div className="friend-avatar">
                  <span>{suggestion.avatar}</span>
                </div>
                <div className="friend-info">
                  <h3 className="friend-name">{suggestion.name}</h3>
                  <span className="friend-username">{suggestion.username}</span>
                  <span className="friend-mutual">{suggestion.mutualFriends} mutual friends</span>
                </div>
                <button className="btn-add-friend">
                  <PlusIcon size={16} />
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove Friend Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!friendToRemove}
        onClose={() => setFriendToRemove(null)}
        onConfirm={handleConfirmRemove}
        isDeleting={isRemoving}
        title="Remove Friend?"
        message={friendToRemove ? `Are you sure you want to remove @${friendToRemove.username} from your friends?` : ''}
      />
    </div>
  );
}

export default Friends;