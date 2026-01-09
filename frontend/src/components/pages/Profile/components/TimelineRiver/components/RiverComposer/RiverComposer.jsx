// =============================================================================
// 🔵 PABLO - UI Architect
// RiverComposer.jsx - Comment input for TimelineRiver posts (inline + full-page)
// =============================================================================
//
// TWO MODES:
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  MODE 1: INLINE COMPOSER (isFullPage = false)                               │
// │  ┌─────────────────────────────────────────────────────────────────────┐   │
// │  │  ┌──────────────────────────────────┐  ┌───┐  ┌───┐                 │   │
// │  │  │ Write a comment...               │  │ ⤢ │  │ > │                 │   │
// │  │  └──────────────────────────────────┘  └───┘  └───┘                 │   │
// │  │       textarea                       expand  submit                  │   │
// │  └─────────────────────────────────────────────────────────────────────┘   │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  MODE 2: FULL-PAGE COMPOSER (isFullPage = true, rendered via Portal)        │
// │  ┌─────────────────────────────────────────────────────────────────────┐   │
// │  │                              [X] Close                               │   │
// │  ├─────────────────────────────────────────────────────────────────────┤   │
// │  │  REPLY CONTEXT (original post - not shown in edit mode)             │   │
// │  │  ┌─────────────────────────────────────────────────────────────┐   │   │
// │  │  │ [avatar] AuthorName @username · 2h ago                      │   │   │
// │  │  │ Original post content here...                               │   │   │
// │  │  │ [media if type='media']                                     │   │   │
// │  │  └─────────────────────────────────────────────────────────────┘   │   │
// │  ├─────────────────────────────────────────────────────────────────────┤   │
// │  │  THREAD VIEW (existing replies)                                     │   │
// │  │  │── [avatar] user1 · 1h - Reply content                           │   │
// │  │  │── [avatar] user2 · 30m - Another reply                          │   │
// │  ├─────────────────────────────────────────────────────────────────────┤   │
// │  │  FIXED COMPOSER (at bottom)                                         │   │
// │  │  ┌─────────────────────────────────────────────────────────────┐   │   │
// │  │  │ Share your thoughts...                              [📷] [>]│   │   │
// │  │  └─────────────────────────────────────────────────────────────┘   │   │
// │  └─────────────────────────────────────────────────────────────────────┘   │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// PROPS:
// - post: The post being commented on
// - isOpen: Boolean - whether composer is visible
// - isFullPage: Boolean - inline mode vs full-page portal mode
// - isEditMode: Boolean - editing existing post (changes placeholder/submit icon)
// - commentText: String - controlled textarea value
// - setCommentText: Function to update commentText
// - threadReplies: Array of existing replies (for full-page mode)
// - onSubmit: Function called when submitting comment
// - onClose: Function to close the composer
// - onExpand: Function to switch from inline to full-page
// - onSaveEdit: Function called when saving edit
// - formatRelativeTime: (dateString) => string
// - isSaving: Boolean - loading state during save
//
// KEYBOARD SHORTCUTS:
// - Enter (without Shift): Submit
// - Escape: Close
//
// =============================================================================

import { createPortal } from 'react-dom';
import './RiverComposer.scss';
import {
  ChevronRightIcon,
  MaximizeIcon,
  CloseIcon,
  ImageIcon,
  CheckIcon,
  UserIcon,
} from '@assets/icons';

const RiverComposer = ({
  post,
  isOpen,
  isFullPage,
  isEditMode = false,
  commentText,
  setCommentText,
  threadReplies = [],
  onSubmit,
  onClose,
  onExpand,
  onSaveEdit,
  formatRelativeTime,
  isSaving = false,
}) => {
  // ─────────────────────────────────────────────────────────────────────────
  // EARLY RETURN
  // ─────────────────────────────────────────────────────────────────────────
  // TODO: Return null if !isOpen or !post

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVED VALUES
  // ─────────────────────────────────────────────────────────────────────────
  // TODO: Extract author info from post.author
  // - postAuthor = post.author || {}
  // - authorName: Use first_name + last_name if both exist, else username, else 'User'

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    // TODO: Handle Enter key (without Shift)
    // - Prevent default
    // - If commentText.trim() is not empty:
    //   - If isEditMode, call onSaveEdit?.()
    //   - Else call onSubmit?.()
    //
    // TODO: Handle Escape key
    // - Call onClose?.()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MODE 1: INLINE COMPOSER
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isFullPage) {
    return (
      <div className="inline-comment-composer">
        <div className="comment-input-wrapper">
          {/* TODO: textarea element
              - className="comment-input"
              - placeholder="Write a comment..."
              - value={commentText}
              - onChange: update commentText AND auto-resize height
                - e.target.style.height = 'auto'
                - e.target.style.height = e.target.scrollHeight + 'px'
              - rows={1}
              - autoFocus
              - onKeyDown={handleKeyDown} */}
          
          {/* TODO: expand button
              - className="expand-composer-btn"
              - onClick={onExpand}
              - title="Expand to full page"
              - Contains MaximizeIcon size={12} strokeWidth="2.5" */}
        </div>

        {/* TODO: submit button
            - className="comment-submit-btn"
            - disabled={!commentText.trim()}
            - onClick={onSubmit}
            - Contains ChevronRightIcon size={20} strokeWidth="2.5" */}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MODE 2: FULL-PAGE COMPOSER (Portal)
  // ═══════════════════════════════════════════════════════════════════════════
  return createPortal(
    <div className="full-page-composer-overlay">
      <div className="full-page-composer">
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* HEADER                                                              */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="full-page-header">
          {/* TODO: Close button
              - className="close-btn-glow"
              - onClick={onClose}
              - title="Close"
              - Contains CloseIcon size={20} */}
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* SCROLLABLE CONTENT                                                  */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="full-page-content">
          {/* TODO: REPLY CONTEXT (only show if !isEditMode)
              - className="reply-context"
              - reply-context-header with avatar, name, handle, dot, time
              - reply-context-content with post.content
              - If post.type === 'media' && post.media_url, show reply-context-media with img */}

          {/* TODO: THREAD VIEW (if threadReplies.length > 0)
              - className="full-page-thread"
              - thread-view wrapper
              - thread-replies container
              - Map through threadReplies, render each reply with:
                - thread-reply wrapper
                - thread-connector with thread-line-vertical
                - reply-card with reply-header (avatar, author, time) and reply-content */}
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* FIXED COMPOSER AT BOTTOM                                            */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="full-page-composer-fixed">
          <div className="comment-input-wrapper">
            {/* TODO: textarea
                - className="comment-input"
                - placeholder varies: "Edit your post..." if isEditMode, else "Share your thoughts..."
                - value, onChange, rows={3}, autoFocus, onKeyDown */}

            {/* TODO: composer-actions div containing:
                - Media button (only if !isEditMode): className="comment-media-btn"
                  - ImageIcon with pink stroke
                - Submit button: className "comment-submit-btn" + "edit-submit-btn" if isEditMode
                  - disabled if !commentText.trim() || isSaving
                  - onClick: call onSaveEdit if isEditMode, else onSubmit
                  - Icon: CheckIcon (yellow) if isEditMode, ChevronRightIcon (green) if not */}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RiverComposer;
