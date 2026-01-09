// 🔵 PABLO - UI Component
// ThreadView.jsx - Twitter-style inline replies thread

import { useState } from 'react';
import { formatRelativeTime } from '@components/pages/Home/utils/timeFormatters';
import {
  UserIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon
} from '@assets/icons';
import './ThreadView.scss';

function ThreadView({
  postId,
  replies,
  isLoading,
  currentUser,
  onCollapse,
  onDeleteReply,
  onUpdateReply,
  showAllReplies,
  onToggleShowAll
}) {
  // Local state for inline editing
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const allReplies = replies || [];
  const visibleReplies = showAllReplies ? allReplies : allReplies.slice(0, 3);
  const hasMore = allReplies.length > 3;

  const handleStartEdit = (reply) => {
    setEditingReplyId(reply.id);
    setEditContent(reply.content);
  };

  const handleCancelEdit = () => {
    setEditingReplyId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (replyId) => {
    if (!editContent.trim()) return;
    
    setIsSaving(true);
    const success = await onUpdateReply(replyId, { content: editContent.trim() });
    if (success) {
      setEditingReplyId(null);
      setEditContent('');
    }
    setIsSaving(false);
  };

  return (
    <div className="thread-view">
      <button 
        className="collapse-thread-btn"
        onClick={onCollapse}
      >
        Hide replies
      </button>
      
      {isLoading ? (
        <div className="thread-loading">Loading replies...</div>
      ) : (
        <div className="thread-replies">
          {visibleReplies.map((reply) => (
            <div key={reply.id} className="thread-reply">
              <div className="thread-connector">
                <div className="thread-line-vertical" />
              </div>
              <div className="reply-card">
                <div className="reply-header">
                  <div className="reply-avatar">
                    <UserIcon size={14} />
                  </div>
                  <span className="reply-author">{reply.author?.username || 'User'}</span>
                  <span className="reply-time">{formatRelativeTime(reply.created_at)}</span>
                  
                  {/* Edit/Delete for owner */}
                  {currentUser && reply.author?.id === currentUser.id && (
                    <div className="reply-actions">
                      <button 
                        className="reply-action-btn"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(reply);
                        }}
                      >
                        <EditIcon size={14} />
                      </button>
                      <button 
                        className="reply-action-btn reply-action-btn--delete"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteReply(reply.id, postId);
                        }}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Reply content - show edit form if editing this reply */}
                {editingReplyId === reply.id ? (
                  <div className="reply-edit-form">
                    <textarea
                      className="reply-edit-input"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveEdit(reply.id);
                        }
                      }}
                    />
                    <div className="reply-edit-actions">
                      <button 
                        className="reply-edit-cancel"
                        onClick={handleCancelEdit}
                        title="Cancel"
                      >
                        <CloseIcon size={16} />
                      </button>
                      <button 
                        className="reply-edit-save"
                        disabled={!editContent.trim() || isSaving}
                        onClick={() => handleSaveEdit(reply.id)}
                        title="Save"
                      >
                        {isSaving ? (
                          <span className="saving-dots">...</span>
                        ) : (
                          <CheckIcon size={20} strokeWidth="2.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="reply-content">{reply.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Show more/less button */}
          {hasMore && (
            <button 
              className="show-more-replies-btn"
              onClick={onToggleShowAll}
            >
              {showAllReplies 
                ? 'Show less' 
                : `Show ${allReplies.length - 3} more ${allReplies.length - 3 === 1 ? 'reply' : 'replies'}`
              }
            </button>
          )}
          
          {allReplies.length === 0 && (
            <div className="no-replies">No replies yet</div>
          )}
        </div>
      )}
    </div>
  );
}

export default ThreadView;
