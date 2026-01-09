// =============================================================================
// 🔵 PABLO - UI Architect | 🟢 COLIN - Post Creation Logic
// ComposerModal.jsx - Modal for creating new posts
// =============================================================================
//
// ┌────────────────────────────────────────────────────────────────────────────┐
// │ Share Your Thoughts                                          [─] [□] [✕]  │
// ├────────────────────────────────────────────────────────────────────────────┤
// │  ┌────┐                                                                    │
// │  │ 👤 │  @username                                                         │
// │  └────┘  🔘 Public                                                         │
// │                                                                            │
// │  ┌────────────────────────────────────────────────────────────────────┐    │
// │  │ What's on your mind?                                               │    │
// │  │                                                                    │    │
// │  │                                                                    │    │
// │  └────────────────────────────────────────────────────────────────────┘    │
// │                                                                            │
// │  [💭 Thought]  [📷 Media]  [🏆 Milestone]  ← type toggle                   │
// ├────────────────────────────────────────────────────────────────────────────┤
// │  [😊] [📍]                                     [Post Thought]             │
// └────────────────────────────────────────────────────────────────────────────┘
//
// =============================================================================

import React, { useState } from 'react';
import './ComposerModal.scss';
import { useAuth, usePosts } from '@contexts';
import {
  MinimizeIcon,
  MaximizeIcon,
  CloseIcon,
  UserIcon,
  CircleIcon,
  ImageIcon,
  MessageBubbleIcon,
  FlagIcon,
  EmojiIcon,
  MapPinIcon
} from '@assets/icons';

function ComposerModal({ showComposer, setShowComposer, composerType, setComposerType }) {
  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT & STATE
  // ─────────────────────────────────────────────────────────────────────────
  const { user } = useAuth();
  const { createPost } = usePosts();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Early return if not showing
  if (!showComposer) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  const handlePost = async () => {
    // TODO: Return early if empty or isPosting
    // TODO: Map composerType to post type ('thought'->'thoughts', 'media'->'media', 'milestone'->'milestones')
    // TODO: Call createPost with { content, type }
    // TODO: On success, clear content and close modal
    // TODO: On error, show alert
  };

  const handleKeyDown = (e) => {
    // TODO: If Cmd/Ctrl + Enter, call handlePost()
  };

  const getButtonText = () => {
    // TODO: Return "Posting..." if isPosting
    // TODO: Return "Post Thought" / "Post Media" / "Post Milestone" based on composerType
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="composer-modal-overlay" onClick={() => setShowComposer(false)}>
      <div 
        className={`composer-modal-content ${isFullscreen ? 'fullscreen' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HEADER                                                              */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="composer-modal-header">
          <h3 className="composer-modal-title">
            {composerType === 'thought' ? 'Share Your Thoughts' : 
             composerType === 'media' ? 'Post Media' : 'Add Milestone'}
          </h3>
          <div className="modal-header-actions">
            <button 
              className="fullscreen-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
            </button>
            <button 
              className="close-btn-glow"
              onClick={() => setShowComposer(false)}
              aria-label="Close"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* BODY                                                                */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="composer-modal-body">
          {/* User Info */}
          <div className="composer-avatar-section">
            <div className="composer-avatar-small">
              <UserIcon size={40} />
            </div>
            <div className="composer-user-info">
              <span className="composer-user-name">{user?.username || 'User'}</span>
              <span className="composer-privacy">
                <CircleIcon size={12} />
                Public
              </span>
            </div>
          </div>

          {/* Textarea */}
          <textarea 
            className={`composer-textarea ${composerType === 'media' ? 'media-mode' : ''}`}
            placeholder={
              composerType === 'thought' ? "What's on your mind?" : 
              composerType === 'media' ? "Add a caption to your media..." : 
              "Describe your milestone..."
            }
            rows={composerType === 'media' ? 2 : 6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={isPosting}
          />

          {/* Media Upload Area (media type only) */}
          {composerType === 'media' && (
            <div className="media-upload-area">
              <div className="media-upload-placeholder">
                <ImageIcon size={48} />
                <p>Click to upload photo or video</p>
                <span>or drag and drop</span>
              </div>
            </div>
          )}

          {/* Milestone Options (milestone type only) */}
          {composerType === 'milestone' && (
            <div className="milestone-options">
              <input 
                type="date" 
                className="milestone-date-input"
                placeholder="When did this happen?"
              />
              <select className="milestone-category-select">
                <option value="">Select category...</option>
                <option value="career">Career</option>
                <option value="education">Education</option>
                <option value="personal">Personal</option>
                <option value="travel">Travel</option>
                <option value="achievement">Achievement</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* Type Toggle Buttons */}
          <div className="composer-type-toggle">
            <button 
              className={`type-toggle-btn type-toggle-thought ${composerType === 'thought' ? 'active' : ''}`}
              onClick={() => setComposerType('thought')}
            >
              <MessageBubbleIcon size={18} />
              Thought
            </button>
            <button 
              className={`type-toggle-btn type-toggle-media ${composerType === 'media' ? 'active' : ''}`}
              onClick={() => setComposerType('media')}
            >
              <ImageIcon size={18} />
              Media
            </button>
            <button 
              className={`type-toggle-btn type-toggle-milestone ${composerType === 'milestone' ? 'active' : ''}`}
              onClick={() => setComposerType('milestone')}
            >
              <FlagIcon size={18} />
              Milestone
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* FOOTER                                                              */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="composer-modal-footer">
          <div className="composer-actions-left">
            <button className="composer-icon-btn" aria-label="Add emoji">
              <EmojiIcon size={20} />
            </button>
            <button className="composer-icon-btn" aria-label="Add location">
              <MapPinIcon size={20} />
            </button>
          </div>
          <button 
            className="composer-post-btn"
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
          >
            {/* TODO: getButtonText() */}
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComposerModal;
