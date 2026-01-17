// 🔵 PABLO - UI/Styling
// RiverFeedView.jsx - Feed mode view for friends' posts
//
// ROW-CHUNKING DESIGN: Each friend's posts are chunked into rows of max 12.
// If a friend has 15 thoughts, they get 2 rows: [3 newest] then [12 older].
// This prevents prolific users from dominating the feed with scattered posts.

import React from 'react';
import './RiverFeedView.scss';
import {
  MessageBubbleIcon,
  ImageIcon,
  MilestoneIcon,
} from '@assets/icons';
import RiverSmartDeck from '../RiverSmartDeck';

const CAROUSEL_LIMIT = 12;

/**
 * Chunk posts into rows of max CAROUSEL_LIMIT (12)
 * Newest posts in first chunk, older in subsequent chunks
 */
const chunkPostsIntoRows = (posts) => {
  if (!posts || posts.length === 0) return [];
  if (posts.length <= CAROUSEL_LIMIT) return [posts];
  
  const rows = [];
  const totalPosts = posts.length;
  const remainder = totalPosts % CAROUSEL_LIMIT;
  
  if (remainder > 0) {
    rows.push(posts.slice(0, remainder));
    for (let i = remainder; i < totalPosts; i += CAROUSEL_LIMIT) {
      rows.push(posts.slice(i, i + CAROUSEL_LIMIT));
    }
  } else {
    for (let i = 0; i < totalPosts; i += CAROUSEL_LIMIT) {
      rows.push(posts.slice(i, i + CAROUSEL_LIMIT));
    }
  }
  
  return rows;
};

/**
 * Determine which category has the most recent post within a row
 */
const getMostRecentTypeForRow = (thoughtsRow, mediaRow, milestonesRow) => {
  const getLatestTimestamp = (posts) => {
    if (!posts || posts.length === 0) return 0;
    return Math.max(...posts.map(p => new Date(p.created_at || 0).getTime()));
  };
  
  const timestamps = {
    thoughts: getLatestTimestamp(thoughtsRow),
    media: getLatestTimestamp(mediaRow),
    milestones: getLatestTimestamp(milestonesRow)
  };
  
  let mostRecent = null;
  let maxTime = 0;
  for (const [type, time] of Object.entries(timestamps)) {
    if (time > maxTime) {
      maxTime = time;
      mostRecent = type;
    }
  }
  return mostRecent;
};

function RiverFeedView({
  friendsGrouped,
  mobileCategory,
  setMobileCategory,
  getDeckIndex,
  handleDeckIndexChange,
  navigate,
  renderPostActions,
  renderCommentSection,
  formatDate,
  onCardClick,
}) {
  
  // Handle card click - don't trigger on interactive elements
  const handleCardClick = (e, post) => {
    if (e.target.closest('button') || 
        e.target.closest('.river-post-actions') ||
        e.target.closest('.river-card-media') ||
        e.target.closest('.river-card-author') ||
        e.target.closest('.inline-comment-composer') ||
        e.target.closest('.thread-view')) {
      return;
    }
    onCardClick?.(post);
  };
  
  // Pre-process friends to chunk their posts into rows
  const friendsWithRows = friendsGrouped.map(friend => ({
    ...friend,
    thoughtRows: chunkPostsIntoRows(friend.thoughts),
    mediaRows: chunkPostsIntoRows(friend.media),
    milestoneRows: chunkPostsIntoRows(friend.milestones),
    rowCount: Math.max(
      chunkPostsIntoRows(friend.thoughts).length,
      chunkPostsIntoRows(friend.media).length,
      chunkPostsIntoRows(friend.milestones).length
    )
  }));

  // Render a thought column for a friend at a specific row
  const renderFriendThoughts = (friend, rowIndex) => {
    const posts = friend.thoughtRows[rowIndex];
    const deckKey = `${friend.username}-thoughts-row${rowIndex}`;
    
    if (!posts || posts.length === 0) {
      return null; // Don't render empty columns
    }
    
    const currentIndex = getDeckIndex(friend.username, `thoughts-row${rowIndex}`);
    const currentPost = posts[currentIndex] || posts[0];
    
    return (
      <div className="river-column-wrapper">
        <div 
          className="river-card text-card"
          onClick={(e) => handleCardClick(e, currentPost)}
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="river-card-author clickable-friend"
            onClick={() => navigate(`/profile/${friend.username}`)}
            title={`View ${friend.username}'s profile`}
          >
            <div className="friend-avatar">{friend.avatar}</div>
            <span className="friend-name">{friend.username}</span>
          </div>
          <div className="river-card-content">
            <p className="river-post-text">{currentPost?.content}</p>
            <span className="river-timestamp">{formatDate(currentPost?.created_at)}</span>
          </div>
          {renderPostActions(currentPost, true)}
          {renderCommentSection(currentPost)}
        </div>
        <RiverSmartDeck
          items={posts}
          deckKey={deckKey}
          currentIndex={currentIndex}
          onIndexChange={handleDeckIndexChange}
        />
      </div>
    );
  };

  // Render a media column for a friend at a specific row
  const renderFriendMedia = (friend, rowIndex) => {
    const posts = friend.mediaRows[rowIndex];
    const deckKey = `${friend.username}-media-row${rowIndex}`;
    
    if (!posts || posts.length === 0) {
      return null; // Don't render empty columns
    }
    
    const currentIndex = getDeckIndex(friend.username, `media-row${rowIndex}`);
    const currentPost = posts[currentIndex] || posts[0];
    
    return (
      <div className="river-column-wrapper">
        <div 
          className="river-card media-card"
          onClick={(e) => handleCardClick(e, currentPost)}
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="river-card-author clickable-friend"
            onClick={() => navigate(`/profile/${friend.username}`)}
            title={`View ${friend.username}'s profile`}
          >
            <div className="friend-avatar">{friend.avatar}</div>
            <span className="friend-name">{friend.username}</span>
          </div>
          <div className="river-card-media">
            {currentPost?.media_url ? (
              <img src={currentPost.media_url} alt="" className="media-image" />
            ) : (
              <div className="media-placeholder">
                <ImageIcon size={40} strokeWidth="1.5" />
              </div>
            )}
          </div>
          <div className="river-card-content">
            <p className="river-post-text">{currentPost?.content}</p>
            <span className="river-timestamp">{formatDate(currentPost?.created_at)}</span>
          </div>
          {renderPostActions(currentPost, true)}
          {renderCommentSection(currentPost)}
        </div>
        <RiverSmartDeck
          items={posts}
          deckKey={deckKey}
          currentIndex={currentIndex}
          onIndexChange={handleDeckIndexChange}
        />
      </div>
    );
  };

  // Render a milestone column for a friend at a specific row
  const renderFriendMilestones = (friend, rowIndex) => {
    const posts = friend.milestoneRows[rowIndex];
    const deckKey = `${friend.username}-milestones-row${rowIndex}`;
    
    if (!posts || posts.length === 0) {
      return null; // Don't render empty columns
    }
    
    const currentIndex = getDeckIndex(friend.username, `milestones-row${rowIndex}`);
    const currentPost = posts[currentIndex] || posts[0];
    
    return (
      <div className="river-column-wrapper">
        <div 
          className="river-card achievement-card"
          onClick={(e) => handleCardClick(e, currentPost)}
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="river-card-author clickable-friend"
            onClick={() => navigate(`/profile/${friend.username}`)}
            title={`View ${friend.username}'s profile`}
          >
            <div className="friend-avatar">{friend.avatar}</div>
            <span className="friend-name">{friend.username}</span>
          </div>
          <div className="river-card-content">
            <p className="river-post-text">{currentPost?.content}</p>
            <span className="river-timestamp">{formatDate(currentPost?.created_at)}</span>
          </div>
          {renderPostActions(currentPost, true)}
          {renderCommentSection(currentPost)}
        </div>
        <RiverSmartDeck
          items={posts}
          deckKey={deckKey}
          currentIndex={currentIndex}
          onIndexChange={handleDeckIndexChange}
        />
      </div>
    );
  };

  return (
    <div className="friends-feed-rows">
      {/* Mobile Category Tabs for Friends Feed */}
      <div className="mobile-category-tabs friends-feed-tabs">
        <button 
          className={`mobile-category-tab ${mobileCategory === 'thoughts' ? 'active' : ''}`}
          onClick={() => setMobileCategory('thoughts')}
        >
          <MessageBubbleIcon size={18} />
          <span>Thoughts</span>
        </button>
        <button 
          className={`mobile-category-tab ${mobileCategory === 'media' ? 'active' : ''}`}
          onClick={() => setMobileCategory('media')}
        >
          <ImageIcon size={18} />
          <span>Media</span>
        </button>
        <button 
          className={`mobile-category-tab ${mobileCategory === 'milestones' ? 'active' : ''}`}
          onClick={() => setMobileCategory('milestones')}
        >
          <MilestoneIcon size={18} />
          <span>Milestones</span>
        </button>
      </div>

      {/* Render each friend's rows */}
      {friendsWithRows.map((friend) => {
        return (
          <div key={friend.username} className="friend-row-group">
            {Array.from({ length: friend.rowCount }, (_, rowIndex) => {
              // Calculate column count for this specific row
              const hasThoughts = friend.thoughtRows[rowIndex]?.length > 0;
              const hasMedia = friend.mediaRows[rowIndex]?.length > 0;
              const hasMilestones = friend.milestoneRows[rowIndex]?.length > 0;
              const columnCount = [hasThoughts, hasMedia, hasMilestones].filter(Boolean).length;
              
              // Get counts and positions for THIS row
              const thoughtsInRow = friend.thoughtRows[rowIndex]?.length || 0;
              const mediaInRow = friend.mediaRows[rowIndex]?.length || 0;
              const milestonesInRow = friend.milestoneRows[rowIndex]?.length || 0;
              
              const thoughtsPosition = getDeckIndex(friend.username, `thoughts-row${rowIndex}`) + 1;
              const mediaPosition = getDeckIndex(friend.username, `media-row${rowIndex}`) + 1;
              const milestonesPosition = getDeckIndex(friend.username, `milestones-row${rowIndex}`) + 1;
              
              // Determine which category is most recent in this row
              const mostRecentType = getMostRecentTypeForRow(
                friend.thoughtRows[rowIndex],
                friend.mediaRows[rowIndex],
                friend.milestoneRows[rowIndex]
              );
              
              return (
                <div key={`${friend.username}-row-${rowIndex}`} className="friend-row">
                  {/* River Column Labels for THIS row */}
                  <div className={`river-labels river-labels--${columnCount}-col`}>
                    {hasThoughts && (
                      <div className={`river-label left-label${mostRecentType === 'thoughts' ? ' river-label--recent' : ''}`}>
                        <MessageBubbleIcon size={20} />
                        <span>Thoughts</span>
                        <span className="river-label-count">{thoughtsInRow}</span>
                      </div>
                    )}
                    {hasMedia && (
                      <div className={`river-label center-label${mostRecentType === 'media' ? ' river-label--recent' : ''}`}>
                        <ImageIcon size={20} />
                        <span>Media</span>
                        <span className="river-label-count">{mediaInRow}</span>
                      </div>
                    )}
                    {hasMilestones && (
                      <div className={`river-label right-label${mostRecentType === 'milestones' ? ' river-label--recent' : ''}`}>
                        <MilestoneIcon size={20} />
                        <span>Milestones</span>
                        <span className="river-label-count">{milestonesInRow}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={`river-streams river-streams--${columnCount}-col mobile-show-${mobileCategory}`}>
                    {/* Left Stream - Thoughts */}
                    {hasThoughts && (
                      <div className="river-column left-stream" data-category="thoughts">
                        {renderFriendThoughts(friend, rowIndex)}
                      </div>
                    )}

                    {/* Center Stream - Media */}
                    {hasMedia && (
                      <div className="river-column center-stream" data-category="media">
                        {renderFriendMedia(friend, rowIndex)}
                      </div>
                    )}

                    {/* Right Stream - Milestones */}
                    {hasMilestones && (
                      <div className="river-column right-stream" data-category="milestones">
                        {renderFriendMilestones(friend, rowIndex)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default RiverFeedView;
