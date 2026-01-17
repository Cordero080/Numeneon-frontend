// 🔵 PABLO - UI/Styling
// RiverTimelineView.jsx - Timeline mode view for own profile posts
// 
// ROW-CHUNKING DESIGN: Posts are grouped into rows of max 12 per category.
// Newest posts appear in the FIRST row (top), older posts flow to subsequent rows.
// This prevents feed clutter from prolific users and maintains chronological clarity.

import React from 'react';
import {
  MessageBubbleIcon,
  ImageIcon,
  ExpandIcon,
  MilestoneIcon,
} from '@assets/icons';
import RiverSmartDeck from '../RiverSmartDeck';
import './RiverTimelineView.scss';

const CAROUSEL_LIMIT = 12;

/**
 * Chunk posts into rows of max CAROUSEL_LIMIT (12)
 * Posts are assumed to be sorted newest-first from the API
 * 
 * Example: 15 posts → [[posts 0-2 (newest 3)], [posts 3-14 (older 12)]]
 * Row 0 (top): 3 newest posts
 * Row 1 (bottom): 12 older posts
 */
const chunkPostsIntoRows = (posts) => {
  if (!posts || posts.length === 0) return [];
  if (posts.length <= CAROUSEL_LIMIT) return [posts];
  
  const rows = [];
  const totalPosts = posts.length;
  const remainder = totalPosts % CAROUSEL_LIMIT;
  
  // First row gets the remainder (newest posts) if there is one
  // Otherwise first row gets full 12
  if (remainder > 0) {
    rows.push(posts.slice(0, remainder));
    // Remaining posts chunked into groups of 12
    for (let i = remainder; i < totalPosts; i += CAROUSEL_LIMIT) {
      rows.push(posts.slice(i, i + CAROUSEL_LIMIT));
    }
  } else {
    // All rows have exactly 12
    for (let i = 0; i < totalPosts; i += CAROUSEL_LIMIT) {
      rows.push(posts.slice(i, i + CAROUSEL_LIMIT));
    }
  }
  
  return rows;
};

/**
 * Calculate how many rows we need based on the category with most posts
 */
const calculateRowCount = (textRows, mediaRows, achievementRows) => {
  return Math.max(textRows.length, mediaRows.length, achievementRows.length);
};

/**
 * Determine which category has the most recent post
 */
const getMostRecentType = (textPosts, mediaPosts, achievementPosts) => {
  const getLatestTimestamp = (posts) => {
    if (!posts || posts.length === 0) return 0;
    return Math.max(...posts.map(p => new Date(p.created_at || 0).getTime()));
  };
  
  const timestamps = {
    thoughts: getLatestTimestamp(textPosts),
    media: getLatestTimestamp(mediaPosts),
    milestones: getLatestTimestamp(achievementPosts)
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

function RiverTimelineView({
  textPosts,
  mediaPosts,
  achievementPosts,
  profileUser,
  mobileCategory,
  setMobileCategory,
  getDeckIndex,
  handleDeckIndexChange,
  setExpandedMediaPost,
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
        e.target.closest('.inline-comment-composer') ||
        e.target.closest('.thread-view')) {
      return;
    }
    onCardClick?.(post);
  };
  // Chunk each category into rows
  const textRows = chunkPostsIntoRows(textPosts);
  const mediaRows = chunkPostsIntoRows(mediaPosts);
  const achievementRows = chunkPostsIntoRows(achievementPosts);
  
  // Total number of rows needed
  const rowCount = calculateRowCount(textRows, mediaRows, achievementRows);
  
  // Determine which category is most recent
  const mostRecentType = getMostRecentType(textPosts, mediaPosts, achievementPosts);

  // Debug logging
  console.log('RiverTimelineView Debug:', {
    textPosts: textPosts?.length,
    textRows: textRows.map(r => r.length),
    mediaRows: mediaRows.map(r => r.length),
    achievementRows: achievementRows.map(r => r.length),
    rowCount,
    mostRecentType,
  });

  // Helper to render a thoughts column for a specific row
  const renderThoughtsColumn = (rowIndex) => {
    const posts = textRows[rowIndex];
    const deckKey = `${profileUser?.username || 'me'}-thoughts-row${rowIndex}`;
    
    if (!posts || posts.length === 0) {
      return <div className="empty-column">{rowIndex === 0 ? 'No thoughts yet' : ''}</div>;
    }
    
    const currentIndex = getDeckIndex(profileUser?.username || 'me', `thoughts-row${rowIndex}`);
    const currentPost = posts[currentIndex] || posts[0];
    
    return (
      <>
        <div 
          className="river-card text-card"
          onClick={(e) => handleCardClick(e, currentPost)}
          style={{ cursor: 'pointer' }}
        >
          <div className="river-card-content">
            <p className="river-post-text">{currentPost?.content}</p>
            <span className="river-timestamp">{formatDate(currentPost?.created_at)}</span>
          </div>
          {renderPostActions(currentPost)}
          {renderCommentSection(currentPost)}
        </div>
        <RiverSmartDeck
          items={posts}
          deckKey={deckKey}
          currentIndex={currentIndex}
          onIndexChange={(key, idx) => handleDeckIndexChange(key, idx)}
        />
      </>
    );
  };

  // Helper to render a media column for a specific row
  const renderMediaColumn = (rowIndex) => {
    const posts = mediaRows[rowIndex];
    const deckKey = `${profileUser?.username || 'me'}-media-row${rowIndex}`;
    
    if (!posts || posts.length === 0) {
      return <div className="empty-column">{rowIndex === 0 ? 'No media yet' : ''}</div>;
    }
    
    const currentIndex = getDeckIndex(profileUser?.username || 'me', `media-row${rowIndex}`);
    const currentPost = posts[currentIndex] || posts[0];
    
    return (
      <>
        <div 
          className="river-card media-card"
          onClick={(e) => handleCardClick(e, currentPost)}
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="river-card-media" 
            onClick={() => setExpandedMediaPost(currentPost)}
            title="Click to expand"
          >
            {currentPost?.media_url ? (
              <>
                <img src={currentPost.media_url} alt="" className="media-image" />
                <div className="media-expand-hint">
                  <ExpandIcon size={20} />
                </div>
              </>
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
          {renderPostActions(currentPost)}
          {renderCommentSection(currentPost)}
        </div>
        <RiverSmartDeck
          items={posts}
          deckKey={deckKey}
          currentIndex={currentIndex}
          onIndexChange={(key, idx) => handleDeckIndexChange(key, idx)}
        />
      </>
    );
  };

  // Helper to render a milestones column for a specific row
  const renderMilestonesColumn = (rowIndex) => {
    const posts = achievementRows[rowIndex];
    const deckKey = `${profileUser?.username || 'me'}-milestones-row${rowIndex}`;
    
    if (!posts || posts.length === 0) {
      return <div className="empty-column">{rowIndex === 0 ? 'No milestones yet' : ''}</div>;
    }
    
    const currentIndex = getDeckIndex(profileUser?.username || 'me', `milestones-row${rowIndex}`);
    const currentPost = posts[currentIndex] || posts[0];
    
    return (
      <>
        <div 
          className="river-card achievement-card"
          onClick={(e) => handleCardClick(e, currentPost)}
          style={{ cursor: 'pointer' }}
        >
          <div className="achievement-badge">
            <MilestoneIcon size={24} />
          </div>
          <div className="river-card-content">
            <p className="river-post-text">{currentPost?.content}</p>
            <span className="river-timestamp">{formatDate(currentPost?.created_at)}</span>
          </div>
          {renderPostActions(currentPost)}
          {renderCommentSection(currentPost)}
        </div>
        <RiverSmartDeck
          items={posts}
          deckKey={deckKey}
          currentIndex={currentIndex}
          onIndexChange={(key, idx) => handleDeckIndexChange(key, idx)}
        />
      </>
    );
  };

  return (
    <>
      {/* Mobile Category Tabs */}
      <div className="mobile-category-tabs">
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

      {/* River Column Labels - desktop only */}
      <div className="river-labels">
        <div className={`river-label left-label${mostRecentType === 'thoughts' ? ' river-label--recent' : ''}`}>
          <MessageBubbleIcon size={20} />
          <span>Thoughts</span>
          <span className="river-label-count">{textPosts?.length || 0}</span>
        </div>
        <div className={`river-label center-label${mostRecentType === 'media' ? ' river-label--recent' : ''}`}>
          <ImageIcon size={20} />
          <span>Media</span>
          <span className="river-label-count">{mediaPosts?.length || 0}</span>
        </div>
        <div className={`river-label right-label${mostRecentType === 'milestones' ? ' river-label--recent' : ''}`}>
          <MilestoneIcon size={20} />
          <span>Milestones</span>
          <span className="river-label-count">{achievementPosts?.length || 0}</span>
        </div>
      </div>

      {/* Render all rows - newest posts in first row (top) */}
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <div key={rowIndex} className={`river-streams river-row-${rowIndex} mobile-show-${mobileCategory}`}>
          {/* Left Stream - Thoughts */}
          <div className="river-column left-stream" data-category="thoughts">
            {renderThoughtsColumn(rowIndex)}
          </div>
          
          {/* Center Stream - Media */}
          <div className="river-column center-stream" data-category="media">
            {renderMediaColumn(rowIndex)}
          </div>
          
          {/* Right Stream - Milestones */}
          <div className="river-column right-stream" data-category="milestones">
            {renderMilestonesColumn(rowIndex)}
          </div>
        </div>
      ))}
    </>
  );
}

export default RiverTimelineView;
