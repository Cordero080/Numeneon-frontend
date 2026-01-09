// =============================================================================
// 🔵 PABLO - UI Architect
// RiverThread.jsx - Displays replies/comments for a post
// =============================================================================
//
// TWO STATES:
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  STATE 1: COLLAPSED (thread not expanded, but has replies)                  │
// │  ┌─────────────────────────────────────────────────────────────────────┐   │
// │  │  ─── View 5 replies                                                 │   │
// │  └─────────────────────────────────────────────────────────────────────┘   │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  STATE 2: EXPANDED (showing replies)                                        │
// │  ┌─────────────────────────────────────────────────────────────────────┐   │
// │  │  [Hide replies]                                                     │   │
// │  │                                                                     │   │
// │  │  │── [avatar] @user1 · 2h ─────────────────────────── [✏️] [🗑️]   │   │
// │  │  │   Reply content here...                                          │   │
// │  │  │                                                                   │   │
// │  │  │── [avatar] @user2 · 1h ─────────────────────────── [✏️] [🗑️]   │   │
// │  │  │   Another reply...                                               │   │
// │  │  │                                                                   │   │
// │  │  │── [avatar] @user3 · 30m ────────────────────────── [✏️] [🗑️]   │   │
// │  │      ┌─────────────────────────────────────────────┐                │   │
// │  │      │ Edit textarea (when editing this reply)     │                │   │
// │  │      │ [Cancel] [Save]                             │                │   │
// │  │      └─────────────────────────────────────────────┘                │   │
// │  │                                                                     │   │
// │  │  [Show 2 more replies]                                              │   │
// │  └─────────────────────────────────────────────────────────────────────┘   │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// PROPS:
// - post: Parent post object (has reply_count)
// - isExpanded: Boolean - whether thread is expanded
// - replies: Array of reply objects
// - isLoading: Boolean - loading state while fetching replies
// - showAllReplies: Boolean - show all vs first 3
// - currentUserId: Number - logged in user's ID (for edit/delete permissions)
// - editingReplyId: Number|null - which reply is being edited
// - editingReplyContent: String - content of reply being edited
// - formatRelativeTime: (dateString) => string
// - onToggleThread: (postId) => void - expand/collapse
// - onShowMore: (postId) => void - show all replies
// - onEditStart: (replyId, content, postId) => void - start editing
// - onEditChange: (newContent) => void - update edit content
// - onEditSave: (replyId, postId) => void - save edit
// - onEditCancel: () => void - cancel editing
// - onDelete: (replyId, postId) => void - delete reply
//
// =============================================================================

import { UserIcon, EditIcon, TrashIcon } from '@assets/icons';

const RiverThread = ({
  post,
  isExpanded,
  replies = [],
  isLoading,
  showAllReplies,
  currentUserId,
  editingReplyId,
  editingReplyContent,
  formatRelativeTime,
  onToggleThread,
  onShowMore,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
}) => {
  // ─────────────────────────────────────────────────────────────────────────
  // EARLY RETURN
  // ─────────────────────────────────────────────────────────────────────────
  // TODO: Return null if !post

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVED VALUES
  // ─────────────────────────────────────────────────────────────────────────
  // TODO: Get replyCount from post.reply_count || 0

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 1: COLLAPSED - "View X replies" button
  // ═══════════════════════════════════════════════════════════════════════════
  // TODO: If !isExpanded && replyCount > 0, return:
  // <button className="view-thread-btn" onClick={() => onToggleThread?.(post.id)}>
  //   <span className="thread-line" />
  //   View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
  // </button>

  // ═══════════════════════════════════════════════════════════════════════════
  // NOT EXPANDED AND NO REPLIES - Return null
  // ═══════════════════════════════════════════════════════════════════════════
  // TODO: If !isExpanded, return null

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVED VALUES FOR EXPANDED STATE
  // ─────────────────────────────────────────────────────────────────────────
  // TODO: Calculate visibleReplies
  // - If showAllReplies: show all replies
  // - Else: show only first 3 (replies.slice(0, 3))
  // TODO: Calculate hasMore = replies.length > 3 && !showAllReplies

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 2: EXPANDED - Show replies
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="thread-view">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* COLLAPSE BUTTON                                                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TODO: button className="collapse-thread-btn"
          - onClick={() => onToggleThread?.(post.id)}
          - Text: "Hide replies" */}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* LOADING STATE                                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TODO: If isLoading, show <div className="thread-loading">Loading replies...</div> */}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* REPLIES LIST                                                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TODO: If not loading, render div className="thread-replies"
          Map through visibleReplies, for each reply render:
          
          <div key={reply.id} className="thread-reply">
            <div className="thread-connector">
              <div className="thread-line-vertical" />
            </div>
            <div className="reply-card">
              <div className="reply-header">
                <div className="reply-avatar"><UserIcon size={14} /></div>
                <span className="reply-author">{reply.author?.username || 'User'}</span>
                <span className="reply-time">{formatRelativeTime?.(reply.created_at)}</span>
                
                // Edit/Delete buttons (only if currentUserId matches reply.author.id)
                {currentUserId && reply.author?.id === currentUserId && (
                  <div className="reply-actions">
                    <button className="reply-action-btn" title="Edit"
                      onClick={(e) => { e.stopPropagation(); onEditStart?.(reply.id, reply.content, post.id); }}>
                      <EditIcon size={14} />
                    </button>
                    <button className="reply-action-btn reply-action-btn--delete" title="Delete"
                      onClick={(e) => { e.stopPropagation(); onDelete?.(reply.id, post.id); }}>
                      <TrashIcon size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              // Reply content - either edit form or display
              {editingReplyId === reply.id ? (
                <div className="reply-edit-form">
                  <textarea className="reply-edit-input" value={editingReplyContent}
                    onChange={(e) => onEditChange?.(e.target.value)} autoFocus />
                  <div className="reply-edit-actions">
                    <button className="reply-edit-btn reply-edit-btn--cancel" onClick={onEditCancel}>Cancel</button>
                    <button className="reply-edit-btn reply-edit-btn--save"
                      onClick={() => onEditSave?.(reply.id, post.id)}
                      disabled={!editingReplyContent?.trim()}>Save</button>
                  </div>
                </div>
              ) : (
                <p className="reply-content">{reply.content}</p>
              )}
            </div>
          </div>
          
          // After map, if hasMore, show "Show X more replies" button
          {hasMore && (
            <button className="show-more-replies-btn" onClick={() => onShowMore?.(post.id)}>
              Show {replies.length - 3} more replies
            </button>
          )}
      */}
    </div>
  );
};

export default RiverThread;
