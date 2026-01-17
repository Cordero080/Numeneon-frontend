/**
 * RiverPostActions - Action buttons for TimelineRiver posts
 * 
 * Renders the like, comment, share, edit, delete buttons
 * Different buttons show depending on isOwnProfile:
 * - Own profile: edit, delete buttons visible
 * - Friend view: message, bookmark buttons visible
 * 
 * 🔗 CONNECTION: Used by TimelineRiver.jsx for both friend and own posts
 */
import './RiverPostActions.scss';
import {
  HeartDynamicIcon,
  MessageBubbleIcon,
  RepostIcon,
  BookmarkIcon,
  EditIcon,
  TrashIcon,
  MessageLineIcon,
} from '@assets/icons';

const RiverPostActions = ({
  post,
  isOwnProfile = false,
  animatingHeartId,
  onLike,
  onComment,
  onEdit,
  onDelete,
  onMessage,
}) => {
  if (!post) return null;

  // Determine CSS class based on context
  const actionsClass = isOwnProfile 
    ? 'river-post-actions my-post-actions' 
    : 'river-post-actions friend-post-actions';

  return (
    <div className={actionsClass}>
      {/* ❤️ Like button - always visible */}
      <div
        className={`river-post-likes ${post.is_liked ? 'is-liked' : ''} ${animatingHeartId === post.id ? 'heart-pulse' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onLike?.(post.id);
        }}
        title={post.is_liked ? 'Unlike' : 'Like'}
        style={{ cursor: 'pointer' }}
      >
        <HeartDynamicIcon size={18} filled={post.is_liked} />
        {post.likes_count || 0}
      </div>

      {/* 💬 Comment button - always visible */}
      <button
        className={`river-action-btn ${post.reply_count > 0 ? 'has-replies' : ''}`}
        title="Comment"
        onClick={() => onComment?.(post.id)}
      >
        <MessageBubbleIcon size={18} stroke="rgba(201,168,255,0.5)" strokeWidth="1.5" />
        {post.reply_count > 0 && <span className="reply-count">{post.reply_count}</span>}
      </button>

      {/* 🔄 Share/Repost button - always visible */}
      <button className="river-action-btn" title={isOwnProfile ? 'Share' : 'Repost'}>
        <RepostIcon size={18} stroke="rgba(79,255,255,0.5)" />
      </button>

      {/* === FRIEND VIEW ONLY === */}
      {!isOwnProfile && (
        <>
          {/* ✉️ Message button */}
          <button
            className="river-action-btn river-action-btn--message"
            title={`Message ${post.author?.username || 'user'}`}
            onClick={(e) => {
              e.stopPropagation();
              onMessage?.({
                id: post.author?.id,
                username: post.author?.username,
                displayName: post.author?.username,
              });
            }}
          >
            <MessageLineIcon size={18} stroke="rgba(0,212,255,0.5)" />
          </button>

          {/* 🔖 Bookmark button */}
          <button className="river-action-btn" title="Bookmark">
            <BookmarkIcon size={18} stroke="rgba(201,168,255,0.5)" strokeWidth="1.5" />
          </button>
        </>
      )}

      {/* === OWN PROFILE ONLY === */}
      {isOwnProfile && (
        <>
          {/* ✏️ Edit button */}
          <button
            className="river-action-btn river-action-btn--edit"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(post);
            }}
          >
            <EditIcon size={18} stroke="rgba(255,193,7,0.6)" strokeWidth="1.5" />
          </button>

          {/* 🗑️ Delete button */}
          <button
            className="river-action-btn river-action-btn--delete"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(post.id);
            }}
          >
            <TrashIcon size={18} stroke="rgba(255,82,82,0.6)" strokeWidth="1.5" />
          </button>
        </>
      )}
    </div>
  );
};

export default RiverPostActions;
