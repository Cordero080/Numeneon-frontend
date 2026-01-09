// 🔵 PABLO - UI Component
// PostCard.jsx - Individual post card with actions

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { formatRelativeTime } from '@components/pages/Home/utils/timeFormatters';
import ThreadView from '../ThreadView';
import RepostModal from '../RepostModal/RepostModal';
import {
  UserIcon,
  HeartDynamicIcon,
  MessageBubbleIcon,
  RepostIcon,
  BookmarkIcon,
  MessageLineIcon,
  GraphLineIcon,
  EditIcon,
  TrashIcon,
  MaximizeIcon,
  ChevronRightIcon,
  CheckIcon,
  CloseIcon,
  ImageIcon,
  VisibilityIcon
} from '@assets/icons';
import './PostCard.scss';

function PostCard({
  post,
  type,
  user,
  currentUser,
  isSinglePost,
  isShortPost,
  // Actions
  onUserClick,
  onLike,
  onShare,
  onComment,
  onMessage,
  onEdit,
  onDelete,
  onExpandMedia,
  // Thread props
  onToggleThread,
  expandedThreadId,
  threadReplies,
  loadingThread,
  showAllReplies,
  onToggleShowAllReplies,
  onReplySubmit,
  onUpdateReply,
  onDeleteReply,
  // Comment composer props
  activeCommentPostId,
  commentText,
  setCommentText,
  setActiveCommentPostId,
  isComposerFullPage,
  setIsComposerFullPage,
  isEditMode,
  setIsEditMode,
  editingPostId,
  setEditingPostId,
  onUpdatePost,
  isSaving
}) {
  // Heart animation state
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  
  // Repost modal state
  const [showRepostModal, setShowRepostModal] = useState(false);
  
  // Type-based heart colors
  const heartColors = {
    thoughts: '#4fffff',    // cyan/blue
    media: '#c9a8ff',       // purple  
    milestones: '#1ae784'   // green
  };
  const heartColor = heartColors[type] || '#4fffff';
  
  return (
    <>
    <div 
      className={`river-post-card post--${type} ${isSinglePost ? 'post--single' : ''} ${isShortPost ? 'post--compact' : ''} fade-in`}
    >
      {/* Header: Avatar + Name + Type Badge */}
      <div className="river-post-header">
        <div 
          className="river-avatar clickable-user" 
          onClick={(e) => onUserClick(e, user.id, user.username)}
          title={`View ${user.name}'s profile`}
        >
          <UserIcon size={24} />
        </div>
        <div className="river-post-info">
          <div 
            className="river-author clickable-user"
            onClick={(e) => onUserClick(e, user.id, user.username)}
            title={`View ${user.name}'s profile`}
          >
            {user.name}
          </div>
          <div className="river-meta">
            <span className="river-timestamp">{formatRelativeTime(post.created_at || post.createdAt)}</span>
          </div>
        </div>
        {/* Privacy icon */}
        <VisibilityIcon visibility={post.visibility} size={20} className="privacy-icon" />
      </div>

      {/* Media Image (only for media posts) */}
      {type === 'media' && post.media_url && (
        <div className="river-post-media" onClick={(e) => {
          e.stopPropagation();
          onExpandMedia(post);
        }}>
          <img src={post.media_url} alt="Post media" className="river-media-image" />
          <div className="media-expand-hint">
            <MaximizeIcon size={20} />
          </div>
        </div>
      )}
      
      {/* Post Content */}
      <p className="river-post-content">{post.content}</p>

      {/* Post Actions */} 
      <div className="river-post-actions">
        {/* Likes */}
        <div 
          className={`river-post-likes ${post.is_liked ? 'is-liked' : ''} ${isHeartAnimating ? 'heart-pulse' : ''}`}
          onClick={async (e) => {
            e.stopPropagation();
            setIsHeartAnimating(true);
            setTimeout(() => setIsHeartAnimating(false), 300);
            await onLike(post.id);
          }}
          title={post.is_liked ? 'Unlike' : 'Like'}
          style={{ cursor: 'pointer', '--heart-color': heartColor }}
        >
          <HeartDynamicIcon size={18} filled={post.is_liked} />
          {post.likes_count || 0}
        </div>
        
        {/* Comment */}
        <button 
          className={`river-action-btn ${post.reply_count > 0 ? 'has-replies' : ''}`}
          title="Comment"
          onClick={() => onComment(post.id)}
        >
          <MessageBubbleIcon size={20} stroke="rgba(201,168,255,0.5)" strokeWidth="1.5" />
          {post.reply_count > 0 && <span className="reply-count">{post.reply_count}</span>}
        </button>
        
        {/* Repost/Share */}
        <button 
          className="river-action-btn" 
          title="Repost"
          onClick={(e) => {
            e.stopPropagation();
            setShowRepostModal(true);
          }}
        >
          <RepostIcon size={20} stroke="rgba(79,255,255,0.5)" strokeWidth="1.5" />
          {post.shares_count > 0 && <span className="share-count">{post.shares_count}</span>}
        </button>
        
        {/* Bookmark */}
        <button className="river-action-btn" title="Bookmark">
          <BookmarkIcon size={20} stroke="rgba(201,168,255,0.5)" strokeWidth="1.5" />
        </button>
        
        {/* Message button - only on OTHER people's posts */}
        {currentUser && post.author?.id !== currentUser.id && (
          <button 
            className="river-action-btn river-action-btn--message" 
            title={`Message ${post.author?.username || 'user'}`}
            onClick={(e) => {
              e.stopPropagation();
              onMessage({
                id: post.author?.id,
                username: post.author?.username,
                displayName: post.author?.username,
              });
            }}
          >
            <MessageLineIcon size={20} stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" />
          </button>
        )}
        
        {/* Analytics, Edit & Delete - only for your own posts */}
        {currentUser && post.author?.id === currentUser.id && (
          <>
            <button className="river-action-btn" title="Analytics">
              <GraphLineIcon size={20} stroke="rgba(26,231,132,0.5)" strokeWidth="1.5" />
            </button>
            <button 
              className="river-action-btn river-action-btn--edit" 
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
            >
              <EditIcon size={20} stroke="rgba(255,193,7,0.6)" strokeWidth="1.5" />
            </button>
            <button 
              className="river-action-btn river-action-btn--delete" 
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post.id);
              }}
            >
              <TrashIcon size={20} stroke="rgba(255,82,82,0.6)" strokeWidth="1.5" />
            </button>
          </>
        )}
      </div>

      {/* Inline Comment Composer */}
      {activeCommentPostId === post.id && !isComposerFullPage && (
        <div className="inline-comment-composer">
          <div className="comment-input-wrapper">
            <textarea
              className="comment-input"
              placeholder="Comment..."
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              rows={1}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (commentText.trim()) {
                    onReplySubmit(post.id, commentText);
                  }
                }
                if (e.key === 'Escape') {
                  setActiveCommentPostId(null);
                  setCommentText('');
                }
              }}
            />
            <button 
              className="expand-composer-btn"
              onClick={() => setIsComposerFullPage(true)}
              title="Expand to full page"
            >
              <MaximizeIcon size={12} strokeWidth="2.5" />
            </button>
          </div>
          <button 
            className="comment-submit-btn"
            disabled={!commentText.trim()}
            onClick={async () => {
              if (commentText.trim()) {
                await onReplySubmit(post.id, commentText);
              }
            }}
          >
            <ChevronRightIcon size={22} strokeWidth="2.5" />
          </button>
        </div>
      )}

      {/* View Thread Link */}
      {post.reply_count > 0 && expandedThreadId !== post.id && (
        <button 
          className="view-thread-btn"
          onClick={() => onToggleThread(post.id)}
        >
          <span className="thread-line" />
          View {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
        </button>
      )}

      {/* Thread View */}
      {expandedThreadId === post.id && (
        <ThreadView
          postId={post.id}
          replies={threadReplies[post.id]}
          isLoading={loadingThread === post.id}
          currentUser={currentUser}
          onCollapse={() => onToggleThread(post.id)}
          onUpdateReply={onUpdateReply}
          onDeleteReply={onDeleteReply}
          showAllReplies={showAllReplies[post.id]}
          onToggleShowAll={() => onToggleShowAllReplies(post.id)}
        />
      )}


      {/* Full Page Composer View */}
      {activeCommentPostId === post.id && isComposerFullPage && createPortal(
        <div className="full-page-composer-overlay">
          <div className="full-page-composer">
            {/* Header with close button */}
            <div className="full-page-header">
              <button 
                className="close-btn-glow"
                onClick={() => {
                  setIsComposerFullPage(false);
                  setIsEditMode(false);
                  setActiveCommentPostId(null);
                  setCommentText('');
                }}
                title="Close"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="full-page-content">
              {/* Original Post Context */}
              {!isEditMode && (
                <div className="reply-context">
                  <div className="reply-context-header">
                    <div className="reply-context-avatar">
                      <UserIcon size={20} />
                    </div>
                    <span className="reply-context-name">{user.name}</span>
                    <span className="reply-context-handle">@{user.username}</span>
                    <span className="reply-context-dot">·</span>
                    <span className="reply-context-time">{formatRelativeTime(post.created_at || post.createdAt)}</span>
                  </div>
                  <p className="reply-context-content">{post.content}</p>
                  {type === 'media' && post.media_url && (
                    <div className="reply-context-media">
                      <img src={post.media_url} alt="Post media" />
                    </div>
                  )}
                  
                  {/* Post Actions in expanded view */}
                  <div className="reply-context-actions">
                    {/* Like */}
                    <div 
                      className={`reply-action-btn ${post.is_liked ? 'is-liked' : ''}`}
                      onClick={async () => await onLike(post.id)}
                      style={{ cursor: 'pointer', '--heart-color': heartColor }}
                    >
                      <HeartDynamicIcon size={18} filled={post.is_liked} />
                      <span>{post.likes_count || 0}</span>
                    </div>
                    {/* Comment count */}
                    <div className="reply-action-btn">
                      <MessageBubbleIcon size={18} stroke="rgba(201,168,255,0.5)" strokeWidth="1.5" />
                      <span>{post.reply_count || 0}</span>
                    </div>
                    {/* Share */}
                    <div 
                      className="reply-action-btn"
                      onClick={() => setShowRepostModal(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      <RepostIcon size={18} stroke="rgba(79,255,255,0.5)" strokeWidth="1.5" />
                      <span>{post.shares_count || 0}</span>
                    </div>
                    {/* Bookmark */}
                    <div className="reply-action-btn" style={{ cursor: 'pointer' }}>
                      <BookmarkIcon size={18} stroke="rgba(201,168,255,0.5)" strokeWidth="1.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Thread View - show existing replies */}
              {threadReplies[post.id] && threadReplies[post.id].length > 0 && (
                <div className="full-page-thread">
                  <ThreadView
                    postId={post.id}
                    replies={threadReplies[post.id]}
                    isLoading={loadingThread === post.id}
                    currentUser={currentUser}
                    onCollapse={() => {}}
                    onUpdateReply={onUpdateReply}
                    onDeleteReply={onDeleteReply}
                    showAllReplies={showAllReplies[post.id]}
                    onToggleShowAll={() => onToggleShowAllReplies(post.id)}
                  />
                </div>
              )}
            </div>

            {/* Fixed Composer at Bottom */}
            <div className="full-page-composer-fixed">
              <div className="comment-input-wrapper">
                <textarea
                  className="comment-input"
                  placeholder={isEditMode ? "Edit your post..." : "Share your thoughts..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (commentText.trim()) {
                        if (isEditMode) {
                          onUpdatePost(editingPostId, { content: commentText.trim() });
                          setEditingPostId(null);
                          setIsEditMode(false);
                        } else {
                          onReplySubmit(post.id, commentText);
                        }
                        setCommentText('');
                      }
                    }
                    if (e.key === 'Escape') {
                      setIsComposerFullPage(false);
                      setIsEditMode(false);
                    }
                  }}
                />
                
                {/* Action buttons inside textarea */}
                <div className="composer-actions">
                  {!isEditMode && (
                    <button 
                      className="comment-media-btn"
                      title="Add media"
                      onClick={() => console.log('Media upload clicked')}
                    >
                      <ImageIcon size={18} stroke="rgba(220, 8, 188, 0.5)" strokeWidth="1.5" />
                    </button>
                  )}
                  
                  <button 
                    className={`comment-submit-btn ${isEditMode ? 'edit-submit-btn' : ''}`}
                    disabled={!commentText.trim() || isSaving}
                    onClick={async () => {
                      if (commentText.trim()) {
                        if (isEditMode) {
                          await onUpdatePost(editingPostId, { content: commentText.trim() });
                          setEditingPostId(null);
                          setIsEditMode(false);
                        } else {
                          await onReplySubmit(post.id, commentText);
                        }
                        setCommentText('');
                      }
                    }}
                  >
                    {isEditMode ? (
                      <CheckIcon size={20} stroke="rgba(255, 193, 7, 0.5)" strokeWidth="2" />
                    ) : (
                      <ChevronRightIcon size={20} stroke="rgba(26, 231, 132, 0.5)" strokeWidth="2" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
    
    {/* Repost Modal */}
    {showRepostModal && (
      <RepostModal
        post={post}
        user={user}
        type={type}
        onClose={() => setShowRepostModal(false)}
        onRepost={onShare}
        onCopyLink={() => {}}
      />
    )}
    </>
  );
}

export default PostCard;
