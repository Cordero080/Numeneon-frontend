// 🔵 PABLO - UI/Styling | 🟢 COLIN + 🟠 TITO - Posts Data Logic
// TimelineRiverFeed.jsx - Main timeline feed with 3-column river layout
//
// ROW-CHUNKING: Posts are chunked into rows of max 12 per category.
// When a user posts 15 thoughts in a day, they get 2 rows: [3 newest] then [12 older].

import { groupPostsByUserAndDay, sortGroupedPosts } from '@components/pages/Home/utils/groupPosts';
import TimelineRiverRow from '../TimelineRiverRow';
import { MessageBubbleIcon, ClockIcon } from '@assets/icons';
import './TimelineRiverFeed.scss';

const CAROUSEL_LIMIT = 12;

/**
 * Chunk posts into groups of max CAROUSEL_LIMIT (12)
 * Newest posts in first chunk, older in subsequent chunks
 */
const chunkPostsIntoRows = (posts) => {
  if (!posts || posts.length === 0) return [[]];
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
 * Split a user's grouped data into multiple rows if any category exceeds 12 posts.
 * Returns an array of rowData objects, each with max 12 posts per category.
 */
const splitGroupIntoRows = (groupData) => {
  const { user, thoughts = [], media = [], milestones = [] } = groupData;
  
  const thoughtRows = chunkPostsIntoRows(thoughts);
  const mediaRows = chunkPostsIntoRows(media);
  const milestoneRows = chunkPostsIntoRows(milestones);
  
  const rowCount = Math.max(thoughtRows.length, mediaRows.length, milestoneRows.length);
  
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    rows.push({
      user,
      thoughts: thoughtRows[i] || [],
      media: mediaRows[i] || [],
      milestones: milestoneRows[i] || [],
      rowIndex: i, // Track which row this is
    });
  }
  
  return rows;
};

function TimelineRiverFeed({ posts, activeCommentPostId, setActiveCommentPostId, commentText, setCommentText, onDeletePost, onUpdatePost }) {
  // Transform flat posts array into grouped structure (no memoization - always fresh)
  const grouped = groupPostsByUserAndDay(posts);
  const groupedAndSortedPosts = sortGroupedPosts(grouped);

  // 🔵 Handle comment toggle (open/close comment box)
  const handleCommentClick = (postId) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);  // Close if already open
      setCommentText('');
    } else {
      setActiveCommentPostId(postId); // Open this post's comment box
      setCommentText('');
    }
  };
// 🔵 Empty state: Show message if no posts
  if (!posts || posts.length === 0) {
    return (
      <div className="timeline-river-empty">
        <MessageBubbleIcon size={48} />
        <p>No posts yet. Be the first to share!</p>
      </div>
    );
  }
// 🟢 Main render: Loop through grouped posts
  return (
    <div className="timeline-river-feed">
      {/* Canopy shadow overlay */}
      <div className="timeline-canopy"></div>
      {groupedAndSortedPosts.map(({ date, orderId, data }) => {
        // Split user's posts into multiple rows if any category exceeds 12
        const rowDataArray = splitGroupIntoRows(data);
        
        return (
          <div key={orderId} className="timeline-river-section">
            {/* 🎨 Last Active Header - only show once per user+day */}
            <div className="river-date-header">
              <div className="river-date-badge">
                <ClockIcon size={16} />
                Last active: {new Date(date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </div>
              <div className="river-divider"></div>
            </div>

            {/* 🟢 Timeline River Rows - one per chunk of 12 */}
            {rowDataArray.map((rowData, rowIndex) => (
              <TimelineRiverRow
                key={`${orderId}-row-${rowIndex}`}
                rowData={rowData}
                onCommentClick={handleCommentClick}
                activeCommentPostId={activeCommentPostId}
                commentText={commentText}
                setCommentText={setCommentText}
                setActiveCommentPostId={setActiveCommentPostId}
                onDeletePost={onDeletePost}
                onUpdatePost={onUpdatePost}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default TimelineRiverFeed;
