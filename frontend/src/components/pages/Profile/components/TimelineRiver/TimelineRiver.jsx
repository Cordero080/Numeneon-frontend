// =============================================================================
// 🔵 PABLO - UI Architect | 🟡 NATALIA - User Posts Data
// TimelineRiver.jsx - Profile timeline showing user's posts in river format
// =============================================================================
//
// ┌────────────────────────────────────────────────────────────────────────────┐
// │  MOBILE: [💭 Thoughts] [📷 Media] [🏆 Milestones]  ← category tabs        │
// ├────────────────────────────────────────────────────────────────────────────┤
// │                                                                            │
// │  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐   │
// │  │   💭 Thoughts       │ │    📷 Media         │ │    🏆 Milestones    │   │
// │  │   ─────────         │ │    ─────            │ │    ──────────       │   │
// │  │  ┌───────────────┐  │ │  ┌───────────────┐  │ │  ┌───────────────┐  │   │
// │  │  │ [Avatar]      │  │ │  │ [Image]       │  │ │  │ [🏆 Badge]    │  │   │
// │  │  │ Post text...  │  │ │  │ Caption...    │  │ │  │ Achievement!  │  │   │
// │  │  │ ❤️ 💬 ✏️ 🗑️   │  │ │  │ ❤️ 💬 ✏️ 🗑️   │  │ │  │ ❤️ 💬 ✏️ 🗑️   │  │   │
// │  │  └───────────────┘  │ │  └───────────────┘  │ │  └───────────────┘  │   │
// │  │  ┌───────────────┐  │ │  ┌───────────────┐  │ │  ┌───────────────┐  │   │
// │  │  │ [Another...]  │  │ │  │ [Another...]  │  │ │  │ [Another...]  │  │   │
// │  │  └───────────────┘  │ │  └───────────────┘  │ │  └───────────────┘  │   │
// │  └─────────────────────┘ └─────────────────────┘ └─────────────────────┘   │
// │                                                                            │
// │  FEED MODE (Friends):                                                      │
// │  ┌─────────────────────────────────────────────────────────────────────┐   │
// │  │  [AB] Arthur's Posts  [← SmartDeck Navigation →]                   │   │
// │  │       💭 "Just shipped..."   📷 [Photo]   🏆 "Got promoted!"      │   │
// │  └─────────────────────────────────────────────────────────────────────┘   │
// └────────────────────────────────────────────────────────────────────────────┘
//
// =============================================================================

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './TimelineRiver.scss';
import {
  CloseIcon,
  CheckIcon,
  EditIcon,
} from '@assets/icons';
import DeleteConfirmModal from '@Home/components/DeleteConfirmModal/DeleteConfirmModal';
import MediaLightbox from '@Home/components/MediaLightbox/MediaLightbox';
import { usePosts, useMessages, useAuth } from '@contexts';
import { 
  RiverPostActions, 
  RiverSmartDeck, 
  RiverComposer, 
  RiverThread, 
  RiverTimelineView, 
  RiverFeedView 
} from './components';

// HELPER: Format relative dates
const formatDate = (dateString) => {
  // TODO: Return "Just now", "5m ago", "2h ago", "3d ago", or "Mar 15"
};

function TimelineRiver({ 
  viewMode, 
  textPosts: textPostsProps, 
  mediaPosts: mediaPostsProps, 
  achievementPosts: achievementPostsProps,
  feedTextPosts,
  feedMediaPosts,
  feedAchievementPosts,
  onDeletePost,
  onUpdatePost,
  isOwnProfile = true,
  profileUser
}) {
  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────────────────
  const { posts: allPosts, likePost, createReply, fetchReplies, updatePost: updateReply, deletePost: deleteReply } = usePosts();
  const { openMessages } = useMessages();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  const getFreshPost = (postId) => allPosts.find(p => p.id === postId);
  
  const getInitials = (author) => {
    // TODO: Return "FL" from first/last, or first 2 of username
  };

  // Map prop posts to fresh versions from context
  const textPosts = (textPostsProps || []).map(p => getFreshPost(p.id) || p);
  const mediaPosts = (mediaPostsProps || []).map(p => getFreshPost(p.id) || p);
  const achievementPosts = (achievementPostsProps || []).map(p => getFreshPost(p.id) || p);

  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTED: Group friends' posts by username (feed mode)
  // ─────────────────────────────────────────────────────────────────────────
  const friendsGrouped = useMemo(() => {
    if (viewMode !== 'feed') return [];
    
    // TODO: Combine all feed posts
    // TODO: Group by username into { username, avatar, thoughts, media, milestones }
    return [];
  }, [viewMode, feedTextPosts, feedMediaPosts, feedAchievementPosts]);

  // ─────────────────────────────────────────────────────────────────────────
  // STATE: Comments & Threads
  // ─────────────────────────────────────────────────────────────────────────
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [threadReplies, setThreadReplies] = useState({});
  const [loadingThread, setLoadingThread] = useState(null);
  const [showAllReplies, setShowAllReplies] = useState({});
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATE: Reply Editing
  // ─────────────────────────────────────────────────────────────────────────
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState('');
  const [editingReplyParentId, setEditingReplyParentId] = useState(null);
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATE: Post Edit/Delete
  // ─────────────────────────────────────────────────────────────────────────
  const [deleteModalPostId, setDeleteModalPostId] = useState(null);
  const [deleteModalIsReply, setDeleteModalIsReply] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [isComposerFullPage, setIsComposerFullPage] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // STATE: Media & UI
  // ─────────────────────────────────────────────────────────────────────────
  const [expandedMediaPost, setExpandedMediaPost] = useState(null);
  const [mobileCategory, setMobileCategory] = useState('thoughts');
  const [animatingHeartId, setAnimatingHeartId] = useState(null);
  const [deckIndices, setDeckIndices] = useState({});

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS: SmartDeck
  // ─────────────────────────────────────────────────────────────────────────
  const getDeckIndex = (username, type) => {
    return deckIndices[`${username}-${type}`] || 0;
  };

  const handleDeckIndexChange = (key, index) => {
    setDeckIndices(prev => ({ ...prev, [key]: index }));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS: Post Actions
  // ─────────────────────────────────────────────────────────────────────────
  const handleLike = async (postId) => {
    // TODO: Set animatingHeartId, clear after 300ms
    // TODO: Call likePost
  };

  const handleEdit = (post) => {
    // TODO: Set editingPostId, commentText, isEditMode, isComposerFullPage
  };

  const handleDelete = (postId) => {
    setDeleteModalPostId(postId);
  };

  const handleCommentClick = (postId) => {
    // TODO: Toggle activeCommentPostId, clear commentText
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS: Threads
  // ─────────────────────────────────────────────────────────────────────────
  const toggleThread = async (postId) => {
    // TODO: Toggle expandedThreadId
    // TODO: Fetch replies if not already loaded (setLoadingThread, fetchReplies)
  };

  const handleCommentSubmit = async (postId) => {
    // TODO: Return early if empty
    // TODO: createReply, add to threadReplies, clear state
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS: Reply Edit/Delete
  // ─────────────────────────────────────────────────────────────────────────
  const handleReplyEdit = (reply, parentId) => {
    // TODO: Set editing state for reply
  };

  const handleReplySave = async () => {
    // TODO: Call updateReply, update threadReplies, clear state
  };

  const handleReplyDelete = (replyId, parentId) => {
    // TODO: Set deleteModalPostId, deleteModalIsReply
  };

  const handleConfirmDelete = async () => {
    // TODO: Call deleteReply or onDeletePost based on deleteModalIsReply
    // TODO: Update threadReplies or let context handle it
    // TODO: Clear modal state
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS: Post Update
  // ─────────────────────────────────────────────────────────────────────────
  const handlePostUpdate = async () => {
    // TODO: Call onUpdatePost with editingPostId and commentText
    // TODO: Clear editing state on success
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS: Card Click → Open Full-Page View
  // ─────────────────────────────────────────────────────────────────────────
  const handleCardClick = async (post) => {
    setActiveCommentPostId(post.id);
    setIsComposerFullPage(true);
    setIsEditMode(false);
    // Fetch replies if not already loaded
    if (!threadReplies[post.id]) {
      setLoadingThread(post.id);
      const result = await fetchReplies(post.id);
      if (result.success) {
        setThreadReplies(prev => ({ ...prev, [post.id]: result.data }));
      }
      setLoadingThread(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="timeline-river">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TIMELINE VIEW (Own posts in 3 columns)                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'timeline' && (
        <RiverTimelineView
          textPosts={textPosts}
          mediaPosts={mediaPosts}
          achievementPosts={achievementPosts}
          mobileCategory={mobileCategory}
          setMobileCategory={setMobileCategory}
          formatDate={formatDate}
          getInitials={getInitials}
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
          // Actions
          handleLike={handleLike}
          handleCommentClick={handleCommentClick}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          toggleThread={toggleThread}
          onCardClick={handleCardClick}
          // State
          animatingHeartId={animatingHeartId}
          activeCommentPostId={activeCommentPostId}
          expandedThreadId={expandedThreadId}
          threadReplies={threadReplies}
          loadingThread={loadingThread}
          showAllReplies={showAllReplies}
          setShowAllReplies={setShowAllReplies}
          // Lightbox
          setExpandedMediaPost={setExpandedMediaPost}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FEED VIEW (Friends' posts grouped by user)                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'feed' && (
        <RiverFeedView
          friendsGrouped={friendsGrouped}
          formatDate={formatDate}
          getInitials={getInitials}
          navigate={navigate}
          openMessages={openMessages}
          // SmartDeck
          getDeckIndex={getDeckIndex}
          handleDeckIndexChange={handleDeckIndexChange}
          // Actions
          handleLike={handleLike}
          handleCommentClick={handleCommentClick}
          toggleThread={toggleThread}
          onCardClick={handleCardClick}
          // State
          animatingHeartId={animatingHeartId}
          activeCommentPostId={activeCommentPostId}
          expandedThreadId={expandedThreadId}
          threadReplies={threadReplies}
          loadingThread={loadingThread}
          // Lightbox
          setExpandedMediaPost={setExpandedMediaPost}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* INLINE COMMENT COMPOSER                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeCommentPostId && (
        <RiverComposer
          postId={activeCommentPostId}
          commentText={commentText}
          setCommentText={setCommentText}
          isFullPage={isComposerFullPage}
          setIsFullPage={setIsComposerFullPage}
          isEditMode={isEditMode}
          onSubmit={isEditMode ? handlePostUpdate : handleCommentSubmit}
          onCancel={() => {
            setActiveCommentPostId(null);
            setCommentText('');
            setIsEditMode(false);
            setEditingPostId(null);
          }}
          isSaving={isSaving}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* THREAD VIEW (Replies)                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {expandedThreadId && threadReplies[expandedThreadId] && (
        <RiverThread
          postId={expandedThreadId}
          replies={threadReplies[expandedThreadId]}
          loadingThread={loadingThread}
          showAllReplies={showAllReplies}
          setShowAllReplies={setShowAllReplies}
          currentUser={currentUser}
          getInitials={getInitials}
          formatDate={formatDate}
          // Reply actions
          editingReplyId={editingReplyId}
          editingReplyContent={editingReplyContent}
          setEditingReplyContent={setEditingReplyContent}
          onReplyEdit={handleReplyEdit}
          onReplySave={handleReplySave}
          onReplyDelete={handleReplyDelete}
          onCancelEdit={() => {
            setEditingReplyId(null);
            setEditingReplyContent('');
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* DELETE CONFIRMATION MODAL                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {deleteModalPostId && (
        <DeleteConfirmModal
          isOpen={!!deleteModalPostId}
          onClose={() => setDeleteModalPostId(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
          itemType={deleteModalIsReply ? 'comment' : 'post'}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MEDIA LIGHTBOX                                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {expandedMediaPost && (
        <MediaLightbox
          post={expandedMediaPost}
          onClose={() => setExpandedMediaPost(null)}
        />
      )}
    </div>
  );
}

export default TimelineRiver;
