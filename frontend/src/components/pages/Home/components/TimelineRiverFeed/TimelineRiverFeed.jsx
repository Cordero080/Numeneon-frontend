// 🔵 PABLO - UI/Styling | 🟢 COLIN + 🟠 TITO - Posts Data Logic
// TimelineRiverFeed.jsx - Main timeline feed with 3-column river layout

import { groupPostsByUserAndDay, sortGroupedPosts } from '@components/pages/Home/utils/groupPosts';
import TimelineRiverRow from '../TimelineRiverRow';
import { MessageBubbleIcon, ClockIcon } from '@assets/icons';
import './TimelineRiverFeed.scss';

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
      {groupedAndSortedPosts.map(({ date, orderId, data }) => (
        // Loop through each user group

        <div key={orderId} className="timeline-river-section">
          {/* 🎨 Last Active Header */}
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

          {/* 🟢 Timeline River Row (renders 3 columns: thoughts, media, milestones) */}
          <TimelineRiverRow
            rowData={data} // ⚠️ Passes grouped data to child
            onCommentClick={handleCommentClick}
            activeCommentPostId={activeCommentPostId}
            commentText={commentText}
            setCommentText={setCommentText}
            setActiveCommentPostId={setActiveCommentPostId}
            onDeletePost={onDeletePost}
            onUpdatePost={onUpdatePost}
          />
        </div>
      ))}
    </div>
  );
}

export default TimelineRiverFeed;
