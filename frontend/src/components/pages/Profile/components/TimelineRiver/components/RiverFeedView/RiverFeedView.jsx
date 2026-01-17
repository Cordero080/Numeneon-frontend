// 🔵 PABLO - UI/Styling
// RiverFeedView.jsx - Feed mode view for friends' posts
//
// ROW-CHUNKING DESIGN: Each friend's posts are chunked into rows of max 12.
// If a friend has 15 thoughts, they get 2 rows: [3 newest] then [12 older].
// This prevents prolific users from dominating the feed with scattered posts.
//
// TODO: Implement RiverFeedView component
//
// ============================================================================
// CONSTANTS
// ============================================================================
// - CAROUSEL_LIMIT = 12 (max posts per row/carousel)
//
// ============================================================================
// HELPER FUNCTIONS (Define OUTSIDE the component)
// ============================================================================
//
// 1. chunkPostsIntoRows(posts)
//    - Purpose: Split posts array into rows of max CAROUSEL_LIMIT (12)
//    - Input: Array of posts (assumed sorted newest-first from API)
//    - Output: Array of arrays (rows)
//    - Logic: Same as RiverTimelineView
//      * If posts.length === 0, return []
//      * If posts.length <= 12, return [posts] (single row)
//      * Otherwise: Calculate remainder = totalPosts % 12
//      * If remainder > 0: First row gets remainder (newest), rest get 12 each
//      * If remainder === 0: All rows get exactly 12
//
// 2. getMostRecentTypeForRow(thoughtsRow, mediaRow, milestonesRow)
//    - Purpose: Find which category has the most recent post WITHIN A SINGLE ROW
//    - Same logic as getMostRecentType but operates on single row arrays
//    - Returns: 'thoughts' | 'media' | 'milestones' | null
//
// ============================================================================
// COMPONENT PROPS
// ============================================================================
// - friendsGrouped: Array of friend objects, each with:
//     { username, avatar, thoughts: [], media: [], milestones: [] }
// - mobileCategory: Current mobile tab selection
// - setMobileCategory: Function to change mobile tab
// - getDeckIndex: Function(username, deckKey) → current carousel index
// - handleDeckIndexChange: Function(deckKey, index) → update carousel index
// - navigate: React Router navigate function
// - renderPostActions: Function(post, isFriendPost) → JSX for actions
// - renderCommentSection: Function(post) → JSX for comment input
// - formatDate: Function(timestamp) → formatted date string
//
// ============================================================================
// PRE-PROCESSING FRIENDS DATA
// ============================================================================
//
// const friendsWithRows = friendsGrouped.map(friend => ({
//   ...friend,
//   thoughtRows: chunkPostsIntoRows(friend.thoughts),
//   mediaRows: chunkPostsIntoRows(friend.media),
//   milestoneRows: chunkPostsIntoRows(friend.milestones),
//   rowCount: Math.max(
//     chunkPostsIntoRows(friend.thoughts).length,
//     chunkPostsIntoRows(friend.media).length,
//     chunkPostsIntoRows(friend.milestones).length
//   )
// }));
//
// ============================================================================
// HELPER RENDER FUNCTIONS (Inside component)
// ============================================================================
//
// renderFriendThoughts(friend, rowIndex):
//   - Get posts = friend.thoughtRows[rowIndex]
//   - Build deckKey = `${friend.username}-thoughts-row${rowIndex}`
//   - If no posts: return null (don't render empty columns)
//   - Get currentIndex from getDeckIndex(friend.username, `thoughts-row${rowIndex}`)
//   - Get currentPost = posts[currentIndex] || posts[0]
//   - Return:
//     <div className="river-column-wrapper">
//       <div className="river-card text-card">
//         <div className="river-card-author clickable-friend" 
//              onClick={() => navigate(`/profile/${friend.username}`)}
//              title={`View ${friend.username}'s profile`}>
//           <div className="friend-avatar">{friend.avatar}</div>
//           <span className="friend-name">{friend.username}</span>
//         </div>
//         <div className="river-card-content">
//           <p className="river-post-text">{currentPost?.content}</p>
//           <span className="river-timestamp">{formatDate(currentPost?.created_at)}</span>
//         </div>
//         {renderPostActions(currentPost, true)}
//         {renderCommentSection(currentPost)}
//       </div>
//       <RiverSmartDeck items={posts} deckKey={deckKey} currentIndex={currentIndex} onIndexChange={handleDeckIndexChange} />
//     </div>
//
// renderFriendMedia(friend, rowIndex):
//   - Same pattern with media card styling
//   - Includes media image display
//
// renderFriendMilestones(friend, rowIndex):
//   - Same pattern with achievement card styling
//
// ============================================================================
// JSX STRUCTURE
// ============================================================================
//
// <div className="friends-feed-rows">
//   {/* Mobile Category Tabs for Friends Feed */}
//   <div className="mobile-category-tabs friends-feed-tabs">
//     <button className={`mobile-category-tab ${mobileCategory === 'thoughts' ? 'active' : ''}`} onClick={() => setMobileCategory('thoughts')}>
//       <MessageBubbleIcon size={18} /><span>Thoughts</span>
//     </button>
//     <button className={`mobile-category-tab ${mobileCategory === 'media' ? 'active' : ''}`} onClick={() => setMobileCategory('media')}>
//       <ImageIcon size={18} /><span>Media</span>
//     </button>
//     <button className={`mobile-category-tab ${mobileCategory === 'milestones' ? 'active' : ''}`} onClick={() => setMobileCategory('milestones')}>
//       <MilestoneIcon size={18} /><span>Milestones</span>
//     </button>
//   </div>
//
//   {/* Render each friend's rows */}
//   {friendsWithRows.map((friend) => (
//     <div key={friend.username} className="friend-row-group">
//       {Array.from({ length: friend.rowCount }, (_, rowIndex) => {
//         // Calculate which columns exist for this row
//         const hasThoughts = friend.thoughtRows[rowIndex]?.length > 0;
//         const hasMedia = friend.mediaRows[rowIndex]?.length > 0;
//         const hasMilestones = friend.milestoneRows[rowIndex]?.length > 0;
//         const columnCount = [hasThoughts, hasMedia, hasMilestones].filter(Boolean).length;
//         
//         // Get counts for labels (per row, not total)
//         const thoughtsInRow = friend.thoughtRows[rowIndex]?.length || 0;
//         const mediaInRow = friend.mediaRows[rowIndex]?.length || 0;
//         const milestonesInRow = friend.milestoneRows[rowIndex]?.length || 0;
//         
//         // Determine most recent type for THIS ROW
//         const mostRecentType = getMostRecentTypeForRow(
//           friend.thoughtRows[rowIndex],
//           friend.mediaRows[rowIndex],
//           friend.milestoneRows[rowIndex]
//         );
//         
//         return (
//           <div key={`${friend.username}-row-${rowIndex}`} className="friend-row">
//             {/* River Column Labels for THIS row - with counts and highlighting */}
//             <div className={`river-labels river-labels--${columnCount}-col`}>
//               {hasThoughts && (
//                 <div className={`river-label left-label${mostRecentType === 'thoughts' ? ' river-label--recent' : ''}`}>
//                   <MessageBubbleIcon size={20} />
//                   <span>Thoughts</span>
//                   <span className="river-label-count">{thoughtsInRow}</span>
//                 </div>
//               )}
//               {hasMedia && (
//                 <div className={`river-label center-label${mostRecentType === 'media' ? ' river-label--recent' : ''}`}>
//                   <ImageIcon size={20} />
//                   <span>Media</span>
//                   <span className="river-label-count">{mediaInRow}</span>
//                 </div>
//               )}
//               {hasMilestones && (
//                 <div className={`river-label right-label${mostRecentType === 'milestones' ? ' river-label--recent' : ''}`}>
//                   <MilestoneIcon size={20} />
//                   <span>Milestones</span>
//                   <span className="river-label-count">{milestonesInRow}</span>
//                 </div>
//               )}
//             </div>
//             
//             {/* Streams for this row - dynamic column count */}
//             <div className={`river-streams river-streams--${columnCount}-col mobile-show-${mobileCategory}`}>
//               {hasThoughts && (
//                 <div className="river-column left-stream" data-category="thoughts">
//                   {renderFriendThoughts(friend, rowIndex)}
//                 </div>
//               )}
//               {hasMedia && (
//                 <div className="river-column center-stream" data-category="media">
//                   {renderFriendMedia(friend, rowIndex)}
//                 </div>
//               )}
//               {hasMilestones && (
//                 <div className="river-column right-stream" data-category="milestones">
//                   {renderFriendMilestones(friend, rowIndex)}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   ))}
// </div>
//
// ============================================================================
// KEY FEATURES CHECKLIST
// ============================================================================
// ✓ Row-chunking per friend: Each friend's posts chunked into rows of max 12
// ✓ Dynamic column count: river-labels--${columnCount}-col and river-streams--${columnCount}-col
// ✓ Per-row most-recent highlighting: getMostRecentTypeForRow for each row
// ✓ Per-row counts: Label shows count for THAT ROW (e.g., "3"), not total
// ✓ Clickable friend avatars: Navigate to friend's profile
// ✓ friend-row-group wrapper: Groups all rows for a single friend
// ✓ deckKey format: "${friend.username}-${type}-row${rowIndex}"
//
// ============================================================================

import React from 'react';
import './RiverFeedView.scss';
import {
  MessageBubbleIcon,
  ImageIcon,
  MilestoneIcon,
} from '@assets/icons';
import RiverSmartDeck from '../RiverSmartDeck';

const CAROUSEL_LIMIT = 12;

// TODO: Implement chunkPostsIntoRows(posts) function here
// TODO: Implement getMostRecentTypeForRow(thoughtsRow, mediaRow, milestonesRow) function here

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
  // Card click handler - excludes interactive elements
  const handleCardClick = (e, post) => {
    if (
      e.target.closest('button') ||
      e.target.closest('.river-post-actions') ||
      e.target.closest('.river-card-media') ||
      e.target.closest('.inline-comment-composer') ||
      e.target.closest('.thread-view') ||
      e.target.closest('.river-card-author')
    ) {
      return;
    }
    onCardClick?.(post);
  };
  // TODO: Pre-process friends to chunk their posts into rows
  // const friendsWithRows = friendsGrouped.map(friend => ({...}));
  
  // TODO: Implement renderFriendThoughts(friend, rowIndex)
  // TODO: Implement renderFriendMedia(friend, rowIndex)
  // TODO: Implement renderFriendMilestones(friend, rowIndex)
  
  // TODO: Return JSX structure as documented above
  return null;
}

export default RiverFeedView;
